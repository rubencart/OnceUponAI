from typing import Dict
import json
import openai
from tqdm import tqdm
import random
import googlemaps
from datetime import datetime
import utils

if __name__ == '__main__':
    obj_path = '/cw/liir/NoCsBack/testliir/rubenc/OUAI-pt2/LDES-API/api_exploration/output/most_recent_objects_v2.json'
    with open(obj_path) as f:
        dsets = json.load(f)

    # example_title = "Lène Maréchal"
    # example_descr = """
    # Marionet uit de figurentheaterproductie 'Lène Maréchal de revue van een proeverigge' van Theater Taptoe. Deze productie werd geschreven door Freek Neirynck en
    # Paul Berkenman en ging in première in 1983. Luk De Bruyker vervaardigde de figuren in de maanden voor de première.
    # """

    with open('/cw/liir/NoCsBack/testliir/rubenc/OUAI-pt2/LDES-API/api_exploration/openai_key.json') as f:
        keys = json.load(f)

    openai_key = keys['openai_key']
    google_maps_key = keys['google_maps_key']

    gmaps = googlemaps.Client(key=google_maps_key)
    openai.api_key = openai_key

    all_objs = [(oid, obj) for dct in dsets.values() for (oid, obj) in dct.items()]
    pls = []
    tot_cnt, cnt = 0, 0
    for i, (obj_id, obj) in tqdm(enumerate(sorted(all_objs, key=lambda x: random.random()))):
        # if len(pls) >= 25 or i > 50 or found_for_col > 5: break
        try:
            payload = utils.payload_from_object(obj_id, obj, openai_key, gmaps)
            if payload is not None:
                cnt += 1
                tot_cnt += 1
                pls.append(payload)
        except Exception as e:
            print(e)
            continue

        if cnt > 100:
            p = f'/cw/liir/NoCsBack/testliir/rubenc/OUAI-pt2/LDES-API/api_exploration/output/gpt_payloads_{tot_cnt}.json'
            with open(p, 'w') as f:
                json.dump(pls, f)
            print('saved payloads to %s' % p)
            cnt = 0
            pls = []

    print('done')
