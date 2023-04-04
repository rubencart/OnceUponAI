import argparse
import itertools
import multiprocessing
import os
import socket
import re
import traceback
from argparse import ArgumentParser
from collections import Counter
from itertools import repeat
from typing import Dict, Tuple, Optional, Set

import httpx
import json
from tqdm import tqdm

import utils


def work(object: Dict, args: argparse.Namespace) -> bool:
    # if possible, download the image from the manifest url in the object dict
    #  see https://ronallo.com/iiif-workshop-new/image-api/uri-parameters.html

    manifest_url = utils.get_manifest_url_from_obj(object)
    try:
        manifest_response = httpx.get(manifest_url, follow_redirects=True).json()
        if 'sequences' in manifest_response:
            canv = manifest_response['sequences'][0]['canvases'][0]
            if 'images' in canv:
                img_dict = canv[0]
                img_url = img_dict['resource']['service']['@id']
                # add image formatting params
                img_url += '/' if img_url[-1] != '/' else ''
                # region/w,h/rotation/quality.format
                img_url += 'full/400,/0/default.jpg'



                return True
    except Exception as e:
        print(e, traceback.format_exc())
        return False
    return False


def run(args: argparse.Namespace):

    with open(args.input_objects) as f:
        dsets = json.load(f)

    with multiprocessing.Pool(args.num_workers) as pool:

        for dset_name, obj_dict in dsets.items():

            objects = list(obj_dict.items())
            result = pool.starmap(work,
                                  tqdm(zip(objects, repeat(args)), total=len(objects)),
                                  chunksize=args.chunksize)

            counts = Counter(result)
            print('# images downloaded for collection %s: %s' % (dset_name, counts[True]))

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
    p.add_argument('--output_dir', type=str, default='')
    p.add_argument('--num_workers', type=int, default=0)
    p.add_argument('--chunk_size', type=int, default=1000)
    obj_path = '/cw/liir/NoCsBack/testliir/rubenc/OUAI-pt2/LDES-API/api_exploration/output/most_recent_objects_debug.json'
    p.add_argument('--input_objects', type=str, default='output/most_recent_objects.json')
    args = p.parse_args()

    if args.output_dir == '':
        host = socket.gethostname()
        homedir = 'home1' if host in ['frodo', 'rose'] else 'home2'
        args.output_dir = os.path.join('/export/%s/NoCsBack/working/' % homedir, '/output/images')

        utils.mkdir_p(args.output_dir)

    run(args)
