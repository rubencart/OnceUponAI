from pymongo import MongoClient
client = MongoClient('localhost', 27017)

# client.onceuponai.obj_location_links.find_one()
list(client.onceuponai.obj_location_links.find())

import json
with open('../../output/clip_payloads.json') as f:
    links = json.load(f)

links2 = [
    {**d, 'object_id': d['object_id'].split('_')[1], 'collection': d['object_id'].split('_')[0]} for d in links
]

res = client.onceuponai.obj_location_links.insert_many(links2)
print(res)
print(list(res))
