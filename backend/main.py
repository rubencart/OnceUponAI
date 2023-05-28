import itertools
import os
import time
from contextlib import asynccontextmanager
from functools import lru_cache
from typing import List, Tuple

# import googlemaps
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.database import Database

# import geo
import nlp
import utils


@asynccontextmanager
async def lifespan(app: FastAPI):
    # If it doesn't exist yet, download the nearest neighbor file from DigitalOcean Spaces
    if not os.path.isfile(utils.get_settings().approx_nn_file):
        print('Downloading test.ann file...')
        await utils.download_ann_file()
        print('Downloaded test.ann file!')
    yield
    # Clean up the file?
    # ml_models.clear()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Conversation(BaseModel):
    messages: List[str] = ['Ik zou graag een kerk zien', 'oke een kapel dan']
    nb_locations: int = 10
    # cur_location: geo.Coordinates = geo.Coordinates(51.05378169999999, 3.7359673)
    cur_location: Tuple[float, float] | None = None


@lru_cache()
def get_hoods_filter():
    return geo.CenterFilter(utils.get_settings().gent_hoods_shp_file)


# @lru_cache()
# def get_gmaps_client() -> googlemaps.Client:
#     return googlemaps.Client(key=utils.get_settings().google_maps_key,)


def get_mongo_db() -> Database:
    # client = MongoClient('localhost', 27017)
    client = MongoClient(utils.get_settings().mongo_uri)
    return client.onceuponai


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/api/walk/old/")
async def create_walk_old(conv: Conversation):
    """
        Usage:
            import requests
            requests.post('http://127.0.0.1:8000/api/walk', json={'nb_locations': 10, 'messages': []}).json()
    :param conv:
    :return:
    """
    concat_conv = '\n'.join(m for m in conv.messages)

    db = get_mongo_db()
    center_filter = get_hoods_filter()

    # get objects from DB
    walk = []
    nb_objects_from_db = 100 * conv.nb_locations
    for i in itertools.count():
        if i > 50:                          break
        if len(walk) >= nb_objects_from_db: break

        # get random objects from the database
        random_objects = list(db.obj_location_links.aggregate([
            # that do have an image_url
            {
                "$match": {
                    "image_url": {
                        "$ne": None
                    }
                }
            },
            { "$sample": { "size": nb_objects_from_db } },
        ]))
        _ = [r.pop('_id') for r in random_objects]

        # add them to the walk if they linked to a location in the center of the city
        random_objects = [
            d for d in random_objects if center_filter(d['coordinates'])
        ]
        walk += random_objects[:nb_objects_from_db - len(walk)]

    # order them into a walking route
    # skip for now
    # walk = await geo.find_shortest_route(get_gmaps_client(), walk,
    #                                      geo.Coordinates(*conv.cur_location))

    print(len(walk))
    start = time.time()
    walk = await nlp.top_txt_matching_filter(concat_conv, walk, n=conv.nb_locations)
    print(time.time() - start)

    return walk


@app.post("/api/walk/")
async def create_walk(conv: Conversation):
    """
        Usage:
            import requests
            requests.post('http://127.0.0.1:8000/api/walk', json={'nb_locations': 10, 'messages': []}).json()
    :param conv:
    :return:
    """
    db = get_mongo_db()

    # get the object indices whose title and description are closest to the conversation
    concat_conv = '\n'.join(m for m in conv.messages)
    print(concat_conv)
    # concat_conv = 'test'
    # if no messages, take a random object as starting point (otherwise would return always
    #   the same for requests without messages)
    if not concat_conv.strip():
        random_obj = next(db.obj_location_links.aggregate([{"$sample": {"size": 1}}]))
        concat_conv += ' ' + utils.obj_to_str(random_obj, add_descr=False)
    nearest_neighbors = await nlp.top_txt_matching_ann(concat_conv, n=conv.nb_locations)
    print(nearest_neighbors)
    # retrieve the objects from the DB
    walk =  db.obj_location_links.find(
        filter={'ann_word_emb_idx': {'$in': nearest_neighbors}},
        projection={"_id": 0, 'in_center': 0, 'ann_word_emb_idx': 0},      # exclude the _id field since it is not JSON serializable
    )
    walk = list(walk)
    # note: only objects with an image_url and a location in the center are included in the
    #   nearest neighbor search

    # order them into a walking route
    # skip for now
    # walk = await geo.find_shortest_route(get_gmaps_client(), walk,
    #                                      geo.Coordinates(*conv.cur_location))
    # print(list(walk))
    return list(walk)
