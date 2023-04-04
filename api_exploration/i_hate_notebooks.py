import argparse
import os
import re
from argparse import ArgumentParser
from typing import Dict, Tuple, Optional, Set

import httpx
import json
from tqdm import tqdm


def get_next_url(next_resp: Dict) -> Tuple[Optional[str], Optional[int]]:
    for rel in next_resp['tree:relation']:
        if rel['@type'] == 'tree:LessThanRelation':
            return rel['tree:node'], rel['tree:remainingItems']
    return None, 0


def get_urls_from_response(resp: Dict) -> Set[str]:
    return set(o['dcterms:isVersionOf'] for o in resp['@included'])


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
    # query the main API endpoint
    base = "https://apidg.gent.be/opendata/adlib2eventstream/v1/"
    dataset = httpx.get(base).json()

    # regex to extract dataset name
    rgx = r"https:\/\/apidg.gent.be\/opendata\/adlib2eventstream\/v1\/([\/a-zA-Z]+)"
    # query the endpoint for each of the main dataset collections
    first_responses = {
        re.match(rgx, d['tree:view']).group(1): [
            httpx.get(d["tree:view"], follow_redirects=True).json()
        ]
        for d in dataset["Datasetcatalogus.heeftDataset"]
    }
    unique_urls = {n: set() for n in first_responses}

    # todo we're assuming the API returns objects in newest first order, so to get the most recent version of an
    #  object, we just keep the one that is returned first
    unique_objects = {n: {} for n in first_responses}

    # for every collection, keep querying the endpoint as long as the last response has a 'lessThanRelation'
    for n, resp_list in first_responses.items():
        if 'thesaurus' in n or 'personen' in n: continue
        if 'tentoonstellingen' in n:            continue
        print(n)

        next_resp = resp_list[0]
        next_node_url, total_items = get_next_url(next_resp)

        remaining_items = total_items
        duplicates = 0
        url_duplicates = 0
        i = 0

        # progress bar
        with tqdm(total=total_items) as pbar:
            while next_node_url is not None:
                i += 1
                if args.debug and i >= 20: break

                # some bookkeeping to count how many 'not-most-recent' versions objects have
                urls_in_resp = get_urls_from_response(next_resp)
                new_urls = urls_in_resp.difference(unique_urls[n])
                url_duplicates += len(urls_in_resp) - len(new_urls)
                unique_urls[n] = unique_urls[n].union(new_urls)

                def url_to_id(url_id):
                    oid_split = url_id.split('/')
                    return f"{oid_split[-2]}_{oid_split[-1]}"

                new_objects = {
                    url_to_id(obj['dcterms:isVersionOf']): obj
                    for obj in next_resp['@included']
                    # if obj['dcterms:isVersionOf'] not in unique_urls[n]
                    if obj['dcterms:isVersionOf'] in new_urls
                }

                unique_objects[n].update(new_objects)

                next_resp = httpx.get(next_node_url, follow_redirects=True).json()
                # will be None when all objects in a collection have been returned
                next_node_url, next_remaining_items = get_next_url(next_resp)
                # update the progress bar
                pbar.update(remaining_items - next_remaining_items)
                remaining_items = next_remaining_items

        print('# duplicates found for %s: %s' % (n, duplicates))
        print('# unique objects found for %s: %s' % (n, len(unique_objects[n])))
        # nb_manifests = len([obj['manifest_url'] for (oid, obj) in unique_objects[n].items()
        #                     if obj['manifest_url'] is not None])
        # print('# manifest urls found for %s: %s' % (n, nb_manifests))

    p = os.path.join(args.output_dir, 'most_recent_objects_v2.json')
    with open(p, 'w') as f:
        json.dump(unique_objects, f)
    print('Saved objects to %s' % p)

    print('Done.')


if __name__ == '__main__':
    p = ArgumentParser()
    p.add_argument('--debug', action='store_true')
    p.add_argument('--output_dir', type=str, default='output/')
    args = p.parse_args()

    run(args)
