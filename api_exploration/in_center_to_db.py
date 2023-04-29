import spacy
from annoy import AnnoyIndex

from pymongo import MongoClient
from tqdm import tqdm

from backend.geo import CenterFilter

if __name__ == '__main__':

    db = MongoClient('localhost', 27017).onceuponai
    objs = list(db.obj_location_links.aggregate([]))

    shp_file = "/Users/rubenc/Documents/rapps/OUAI-pt2/stadswijken-gent/stadswijken-gent.shp"
    center_filter = CenterFilter(shp_file)

    for obj in objs:
        in_center = center_filter(obj['coordinates'])
        db.obj_location_links.update_one({'_id': obj['_id']}, {'$set': {'in_center': in_center}})

    print('done')
