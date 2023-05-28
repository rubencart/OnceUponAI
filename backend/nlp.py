from functools import lru_cache
from typing import List, Any, Dict

import numpy as np
import spacy
from annoy import AnnoyIndex
from spacy import Language

import utils


@lru_cache
def get_spacy() -> Language:
    nlp = spacy.load("nl_core_news_lg",
                     disable=['morphologizer', 'tagger', 'parser', 'lemmatizer', 'attribute_ruler', 'ner']
                     )
    return nlp


@lru_cache()
def get_annoy() -> AnnoyIndex:
    u = AnnoyIndex(300, 'euclidean')
    u.load(utils.get_settings().approx_nn_file)
    return u


async def top_txt_matching_filter(conv: str, candidate_objs: List[Dict[str, Any]],
                                  n: int = 10) -> List[Dict[str, Any]]:
    nlp = get_spacy()

    conv_doc = nlp(conv)
    obj_docs = nlp.pipe(['%s. %s' % (obj['title'], obj['description']) for obj in candidate_objs],
                        batch_size=50)
    obj_docs = list(obj_docs)
    matrix = np.array([d.vector for d in obj_docs])

    similarities = np.inner(conv_doc.vector, matrix)
    similarities /= np.linalg.norm(matrix, axis=-1)
    top_n = np.argpartition(similarities, -min(n, len(similarities)))[-n:]
    return [candidate_objs[i] for i in top_n]


async def top_txt_matching_ann(conv: str, n: int = 10) -> List[int]:
    nlp = get_spacy()
    ann_index = get_annoy()
    conv_doc = nlp(conv)
    nearest_neighbors = ann_index.get_nns_by_vector(conv_doc.vector, n=n, search_k=5000)
    return nearest_neighbors
