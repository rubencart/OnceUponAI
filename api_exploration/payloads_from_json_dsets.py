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


    example_title = "Lène Maréchal"
    example_descr = """
    Marionet uit de figurentheaterproductie 'Lène Maréchal de revue van een proeverigge' van Theater Taptoe. Deze productie werd geschreven door Freek Neirynck en
    Paul Berkenman en ging in première in 1983. Luk De Bruyker vervaardigde de figuren in de maanden voor de première.
    """


    with open('/cw/liir/NoCsBack/testliir/rubenc/OUAI-pt2/LDES-API/api_exploration/openai_key.json') as f:
        keys = json.load(f)

    openai_key = keys['openai_key']
    google_maps_key = keys['google_maps_key']

    gmaps = googlemaps.Client(key=google_maps_key)
    openai.api_key = openai_key


    pls = []
    for col, obj_dict in tqdm(dsets.items()):
        found_for_col = 0
        for i, (obj_id, obj) in enumerate(sorted(obj_dict.items(), key=lambda x: random.random())):
            if len(pls) >= 25 or i > 50 or found_for_col > 5: break
            payload = utils.payload_from_object(obj_id, obj, openai_key, gmaps)
            if payload is not None:
                found_for_col += 1
                pls.append(payload)

    with open('output/payloads.json', 'w') as f:
        json.dump(pls, f)
    print('done')
