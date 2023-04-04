import argparse
import multiprocessing
import os
import socket
import traceback
from argparse import ArgumentParser
from collections import Counter
from itertools import repeat
from typing import Dict, Tuple, Optional, Set

import httpx
import json
from tqdm import tqdm

import utils


def work(object_id: str, object: Dict, args: argparse.Namespace) -> bool:
    # if possible, download the image from the manifest url in the object dict
    #  see https://ronallo.com/iiif-workshop-new/image-api/uri-parameters.html
    try:
        # find the manifest url in the object data
        manifest_url = utils.get_manifest_url_from_obj(object)
        # query it
        manifest_response = httpx.get(manifest_url, follow_redirects=True).json()

        # find the image url in the manifest response
        if 'sequences' in manifest_response:
            canv = manifest_response['sequences'][0]['canvases'][0]
            if 'images' in canv:
                img_dict = canv['images'][0]
                img_url = img_dict['resource']['service']['@id']

                # add image formatting params
                img_url += '/' if img_url[-1] != '/' else ''
                # region/w,h/rotation/quality.format
                # (scales the height proportionally)
                img_url += f'full/{args.image_width},/0/default.jpg'

                # get the image
                response = httpx.get(img_url)

                # save the image
                # filename = f"{manifest_url.split('/')[-1].replace(':', '__')}.jpg"
                if 'http' in object_id:
                    oid_split = object_id.split('/')
                    filename = f"{oid_split[-2]}_{oid_split[-1]}.jpg"
                else:
                    filename = f"{object_id}.jpg"

                path = os.path.join(args.output_dir, filename)
                with open(path, 'wb') as f:
                    f.write(response.content)

                return True
    except Exception as e:
        print(object_id, e, traceback.format_exc())
        return False
    return False


def run(args: argparse.Namespace):

    # load the json with the object information
    with open(args.input_objects) as f:
        dsets = json.load(f)

    failed = {}
    # distribute the downloading work over a pool of worker processes
    with multiprocessing.Pool(args.num_workers) as pool:
        print('Started MP pool with %s workers' % args.num_workers)

        for dset_name, obj_dict in dsets.items():
            print(dset_name)

            if len(obj_dict) > 0:
                object_ids, objects = zip(*obj_dict.items())

                if args.debug:  # if debugging, don't use parallel processes
                    result = []
                    for oid, obj in tqdm(zip(object_ids, objects)):
                        result.append(work(oid, obj, args))

                else:
                    result = pool.starmap(work,
                                          tqdm(zip(object_ids, objects, repeat(args)), total=len(objects)),
                                          chunksize=args.chunksize)

                counts = Counter(result)
                print('# images downloaded for collection %s: %s' % (dset_name, counts[True]))
                print('# images download failed for collection %s: %s' % (dset_name, counts[False]))

                if counts[False] > 0:
                    failed_ids = [oid for (oid, downloaded) in zip(object_ids, result) if downloaded]
                    failed[dset_name] = failed_ids

    if len(failed) > 0:
        failed_path = os.path.join(args.input_objects.split['/'][0], 'failed_ids.json')
        print('Saving failed ids to %s' % failed_path)
        with open(failed_path, 'w') as f:
            json.dump(failed_ids, f)

    print('Done.')


if __name__ == '__main__':
    p = ArgumentParser()
    p.add_argument('--debug', action='store_true')
    p.add_argument('--output_dir', type=str, default='')
    p.add_argument('--num_workers', type=int, default=10, help='Amount of parallel worker processes to use. Minimum: 1.')
    p.add_argument('--chunksize', type=int, default=50)
    p.add_argument('--image_width', type=int, default=300)

    obj_path = '/cw/liir/NoCsBack/testliir/rubenc/OUAI-pt2/LDES-API/api_exploration/output/most_recent_objects.json'
    p.add_argument('--input_objects', type=str, default=obj_path)
    args = p.parse_args()

    if args.output_dir == '':
        host = socket.gethostname()
        homedir = 'home1' if host in ['frodo', 'rose'] else 'home2'
        args.output_dir = '/export/%s/NoCsBack/working/rubenc/OUAI-Gent/images%s/' \
                          % (homedir, '_debug' if args.debug else '')

        utils.mkdir_p(args.output_dir)
    print('Using output dir %s' % args.output_dir)

    run(args)
