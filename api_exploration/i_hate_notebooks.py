import argparse
import itertools
import multiprocessing
import os
import re
import traceback
from argparse import ArgumentParser
from itertools import repeat
from typing import Dict, Tuple, Optional, Set

import httpx
import json
from tqdm import tqdm


def get_next_url(next_resp: Dict) -> Tuple[Optional[str], Optional[int]]:
    for rel in next_resp['tree:relation']:
        if rel['@type'] == 'tree:LessThanRelation':
            return rel['tree:node'], rel['tree:remainingItems']
    return None, 0


def get_ids_from_response(resp: Dict) -> Set[str]:
    # todo sometimes there are more than 1 ids, from different systems. We should use 1 system
    return set(
        o['Object.identificator'][0]['Identificator.identificator']['@value'] for o in resp['@included']
    )


def get_urls_from_response(resp: Dict) -> Set[str]:
    return set(o['dcterms:isVersionOf'] for o in resp['@included'])


def work():
    pass


def run(args: argparse.Namespace):
    """
        https://github.com/TREEcg/event-stream-client/tree/main/packages/actor-init-ldes-client
        Download script using LDES client: https://github.com/rubencart/OUAI-Gent/blob/main/draft/fetch.sh
        downloaded outputX.json files on netapp, can't read because not json...
        --> https://github.com/digitalbazaar/pyld
            https://github.com/RDFLib/rdflib
            https://json-ld.org/

        API "documentation":
        https://github.com/CoGhent/api-docs-tooling/wiki/API-Endpoints#ldes-linked-data-event-stream
        https://apidg.gent.be/opendata/adlib2eventstream/v1/api-docs/

    """
    base = "https://apidg.gent.be/opendata/adlib2eventstream/v1/"
    dataset = httpx.get(base).json()

    rgx = r"https:\/\/apidg.gent.be\/opendata\/adlib2eventstream\/v1\/([\/a-zA-Z]+)"
    first_responses = {
        re.match(rgx, d['tree:view']).group(1): [
            httpx.get(d["tree:view"], follow_redirects=True).json()
        ]
        for d in dataset["Datasetcatalogus.heeftDataset"]
    }
    obj_ids = {n: set() for n in first_responses}
    unique_urls = {n: set() for n in first_responses}

    # todo we're assuming the API returns objects in newest first order, so to get the most recent version of an
    #  object, we just keep the one that is returned first
    unique_objects = {n: {} for n in first_responses}

    # rgx = r"https:\/\/apidg.gent.be\/opendata\/adlib2eventstream\/v1\/([\/a-zA-Z]+)\?generatedAtTime=[\S]*"

    for n, resp_list in first_responses.items():
        if 'thesaurus' in n or 'personen' in n: continue
        if 'tentoonstellingen' in n:            continue
        # if 'archiefgent' in n:                  continue
        print(n)

        next_resp = resp_list[0]

        # obj_ids[n] = obj_ids[n].union(get_ids_from_response(next_resp))
        # unique_urls[n] = unique_urls[n].union(get_urls_from_response(next_resp))

        next_node_url, total_items = get_next_url(next_resp)

        remaining_items = total_items
        duplicates = 0
        url_duplicates = 0
        i = 0

        # with multiprocessing.Pool(args.num_workers) as pool:
        #     result = pool.starmap(work,
        #                           tqdm(zip(lines, repeat(num_words), repeat(tg_encoding), repeat(rb)),
        #                                total=total),
        #                           chunksize=chunksize)


        # try:
        with tqdm(total=total_items) as pbar:
            while next_node_url is not None:
                i += 1
                if args.debug and i >= 20: break

                # next_node_url, next_remaining_items = get_next_url(next_resp)
                # pbar.update(remaining_items - next_remaining_items)
                # remaining_items = next_remaining_items

                # next_resp = httpx.get(next_node_url, follow_redirects=True).json()

                # resp_list.append(next_resp)     # we can drop this to save memory

                # new_ids = get_ids_from_response(next_resp)
                # duplicates += len(new_ids.intersection(obj_ids[n]))
                # obj_ids[n] = obj_ids[n].union(new_ids)

                urls_in_resp = get_urls_from_response(next_resp)
                new_urls = urls_in_resp.difference(unique_urls[n])
                url_duplicates += len(urls_in_resp) - len(new_urls)
                # url_duplicates += len(new_urls.intersection(unique_urls[n]))
                unique_urls[n] = unique_urls[n].union(new_urls)

                new_objects = {
                    obj['dcterms:isVersionOf']: obj for obj in next_resp['@included']
                    # if obj['dcterms:isVersionOf'] not in unique_urls[n]
                    if obj['dcterms:isVersionOf'] in new_urls
                }
                # new_urls = new_objects.keys()
                # url_duplicates += len(unique_urls[n].intersection(new_urls))
                # unique_urls[n] = unique_urls[n].union(new_urls)

                # unique_objects[n] = {
                #     **{
                #         url: {
                #             'object': obj,
                #             'manifest_url': get_manifest_url_from_obj(obj),
                #         }
                #         for url, obj in new_objects.items()
                #       },
                #     # do this last so objects that were saved already override new objects (newest first)
                #     #  (doesn't matter anymore now)
                #     **unique_objects[n],
                # }
                # unique_objects[n].update({
                #     url: {
                #         'object': obj,
                #         'manifest_url': get_manifest_url_from_obj(obj),
                #     }
                #     for url, obj in new_objects.items()
                # })
                unique_objects[n].update(new_objects)

                next_resp = httpx.get(next_node_url, follow_redirects=True).json()
                next_node_url, next_remaining_items = get_next_url(next_resp)
                pbar.update(remaining_items - next_remaining_items)
                remaining_items = next_remaining_items

        # except Exception as e:
        #     print(e)
        #     traceback.print_exc()
        #
        # finally:
        print('# duplicates found for %s: %s' % (n, duplicates))
        print('# unique objects found for %s: %s' % (n, len(unique_objects[n])))
        # nb_manifests = len([obj['manifest_url'] for (oid, obj) in unique_objects[n].items()
        #                     if obj['manifest_url'] is not None])
        # print('# manifest urls found for %s: %s' % (n, nb_manifests))

    p = os.path.join(args.output_dir, 'most_recent_objects.json')
    with open(p, 'w') as f:
        json.dump(unique_objects, f)
    print('Saved objects to %s' % p)

    # obj0_next = objects[0]
    # obj0_ids = []
    # for _ in range(20):
    #     obj0_ids += [o['Object.identificator'][0]['Identificator.identificator']['@value'] for o in
    #                  obj0_next['@included']]
    #     obj0_next = httpx.get(obj0_next['tree:relation'][0]["tree:node"], follow_redirects=True).json()
    # obj0_ids = set(obj0_ids)

    # with open('../../../OUAI-Gent/output2.json', 'r') as f:
    #     data = json.load(f)

    print('ok')


if __name__ == '__main__':
    p = ArgumentParser()
    # p.add_argument('--run_name', type=str, default='debug')
    # p.add_argument('--in_dir', type=str, default='')
    # p.add_argument('--in_name', type=str, default='')
    # p.add_argument('--not_in_dir', type=str, default='NOT_IN_DIR')
    # p.add_argument('--start', type=int, default=-1)
    # p.add_argument('--filter_errors', action='store_true')
    # p.add_argument('--errors', type=int, default=0)
    # p.add_argument('--save_train_predictions', type=int, default=1)

    p.add_argument('--debug', action='store_true')
    p.add_argument('--output_dir', type=str, default='output/')
    p.add_argument('--num_workers', type=int, default=0)
    args = p.parse_args()

    run(args)
