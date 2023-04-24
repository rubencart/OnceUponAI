from typing import List

from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.database import Database

app = FastAPI()


class Message(BaseModel):
    content: str = ''


class Conversation(BaseModel):
    messages: List[str] | None = None
    nb_locations: int = 10


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
    random_object_locations = list(db.obj_location_links.aggregate([
        { "$sample": { "size": conv.nb_locations } },
    ]))
    _ = [r.pop('_id') for r in random_object_locations]

    return random_object_locations
