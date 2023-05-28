import spacy
from annoy import AnnoyIndex

from pymongo import MongoClient
from tqdm import tqdm

if __name__ == '__main__':

    # get objs from database
    db = MongoClient('localhost', 27017).onceuponai
    print(db.obj_location_links.count_documents({}))
    objs = list(db.obj_location_links.aggregate([
        # that do have an image_url
        {
            "$match": {
                "image_url": {
                    "$ne": None
                },
                "in_center": {
                    "$eq": True
                }
            }
        },
    ]))
    print(len(objs))

    # erase existing ANN links
    db.obj_location_links.update_many({}, {'$set': {'ann_word_emb_idx': None}})

    # compute embeddings with spacy
    nlp = spacy.load("nl_core_news_lg",
                     disable=['morphologizer', 'tagger', 'parser', 'lemmatizer', 'attribute_ruler', 'ner'])

    def to_str(obj):
        res = obj['title']
        if obj['description'].strip() != '':
            desc = obj['description'].replace('Het CLIP AI model heeft dit object gelinkt met deze locatie: ', '')
            res += f". {desc}"
        return res

    obj_docs = nlp.pipe([to_str(obj) for obj in objs], batch_size=50)

    # store the embeddings in an approximate nearest-neighbor index for fast retrieval
    # https://github.com/spotify/annoy
    # spacy embeddings have dim 300
    dim = 300

    t = AnnoyIndex(dim, 'euclidean')
    index_map = {}
    for i, (obj_d, obj) in tqdm(enumerate(zip(obj_docs, objs))):
        index_map[i] = (obj['object_id'], obj['_id'])
        t.add_item(i, obj_d.vector)
        db.obj_location_links.update_one({'_id': obj['_id']}, {'$set': {'ann_word_emb_idx': i}})

    t.build(500)  # nb of trees
    t.save('../output/test.ann')

    u = AnnoyIndex(dim, 'euclidean')
    u.load('../output/test.ann')  # super fast, will just mmap the file
    nns = u.get_nns_by_vector(nlp('test').vector, 5)
    print(nns)
    print([objs[i] for i in nns])
    print('done')
