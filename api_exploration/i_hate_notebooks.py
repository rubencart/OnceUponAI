
import httpx
import json


def run():
    """
        https://github.com/TREEcg/event-stream-client/tree/main/packages/actor-init-ldes-client
        Download script using LDES client: https://github.com/rubencart/OUAI-Gent/blob/main/draft/fetch.sh
        downloaded outputX.json files on netapp, can't read because not json...
        --> https://github.com/digitalbazaar/pyld
            https://github.com/RDFLib/rdflib
            https://json-ld.org/
            
        API "documentation":
        https://github.com/CoGhent/api-docs-tooling/wiki/API-Endpoints#ldes-linked-data-event-stream
        https://apidg.gent.be/opendata/adlib2eventstream/v1/api-docs/

    """
    base = "https://apidg.gent.be/opendata/adlib2eventstream/v1/"
    datasets = httpx.get(base).json()

    objects = [
        httpx.get(d["tree:view"], follow_redirects=True).json() for d in datasets["Datasetcatalogus.heeftDataset"]
    ]

    obj0_next = objects[0]
    obj0_ids = []
    for _ in range(20):
        obj0_ids += [o['Object.identificator'][0]['Identificator.identificator']['@value'] for o in
                     obj0_next['@included']]
        obj0_next = httpx.get(obj0_next['tree:relation'][0]["tree:node"], follow_redirects=True).json()
    obj0_ids = set(obj0_ids)

    # with open('../../../OUAI-Gent/output2.json', 'r') as f:
    #     data = json.load(f)

    print('ok')


if __name__ == '__main__':
    run()
