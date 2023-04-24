import itertools
from functools import lru_cache
from typing import List

from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.database import Database

import config
import geo

app = FastAPI()


class Message(BaseModel):
    content: str = ''


class Conversation(BaseModel):
    messages: List[str] | None = None
    nb_locations: int = 10


@lru_cache()
def get_settings():
    return config.Settings()


@lru_cache()
def get_hoods_filter():
    return geo.CenterFilter(get_settings().gent_hoods_shp_file)


def get_mongo_db() -> Database:
    client = MongoClient('localhost', 27017)
    return client.onceuponai


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/api/walk/")
async def create_walk(conv: Conversation):
    """
        Usage:
            import requests
            requests.post('http://127.0.0.1:8000/api/walk', json={'nb_locations': 10, 'messages': []}).json()
    :param conv:
    :return:
    """
    concat_conv = '\n'.join(m for m in conv.messages)

    db = get_mongo_db()
    c_filter = get_hoods_filter()

    walk = []
    for i in itertools.count():
        if i > 100:                        break
        if len(walk) >= conv.nb_locations: break

        # get random objects from the database
        random_objects = list(db.obj_location_links.aggregate([
            { "$sample": { "size": 2 * conv.nb_locations } },
        ]))
        _ = [r.pop('_id') for r in random_objects]

        # add them to the walk if they linked to a location in the center of the city
        random_objects = [
            d for d in random_objects if c_filter.is_in_center(d['coordinates'])
        ]
        walk += random_objects[:conv.nb_locations - len(walk)]

    return walk
