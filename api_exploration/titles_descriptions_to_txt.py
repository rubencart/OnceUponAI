
from typing import Dict

obj_path = '/cw/liir/NoCsBack/testliir/rubenc/OUAI-pt2/LDES-API/api_exploration/output/most_recent_objects_v2.json'
with open(obj_path) as f:
    dsets = json.load(f)

titles_descs = []
for col, obj_dict in dsets.items():
    for i, (obj_id, obj) in enumerate(obj_dict.items()):
        if i >= 100: break
        titles_descs.append({
            'object_id': obj_id,
            'title': obj['MensgemaaktObject.titel']['@value'],
            'description': obj.get('Entiteit.beschrijving', {}).get('@value', ''),
        })


def rec_to_line(rec: Dict[str, str]) -> str:
    line = f'ID: {rec["object_id"]} - Titel: {rec["title"]}'
    if rec['description']:
        line += f' - Beschrijving: {rec["description"]}'
    line += '\n'
    return line


with open('LDES-API/api_exploration/output/titels.txt', 'w', encoding='utf-8') as f:
    f.writelines([
        rec_to_line(rec) for rec in titles_descs
    ])
