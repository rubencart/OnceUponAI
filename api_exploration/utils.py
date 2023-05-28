import errno
import os
from typing import Dict, Optional, Any, Tuple

import googlemaps
import httpx
import openai


def mkdir_p(path):
    try:
        os.makedirs(path)
    except OSError as exc:  # Python >2.5
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else:
            raise


def get_manifest_url_from_obj(obj: Dict) -> Optional[str]:
    # todo multiple options?
    if 'Entiteit.isHetOnderwerpVan' in obj:
        for element in obj['Entiteit.isHetOnderwerpVan']:
            if element['@type'] == 'DigitalObject' and any('iiif' in c['@id'] for c in element['conforms_to']):
                return element['@id']
    return None


def get_img_url_from_obj(obj: Dict, image_width: int = 400) -> Optional[str]:
    manifest_url = get_manifest_url_from_obj(obj)
    # query it
    manifest_response = httpx.get(manifest_url, follow_redirects=True, timeout=30).json()

    # find the image url in the manifest response
    if 'sequences' in manifest_response:
        canv = manifest_response['sequences'][0]['canvases'][0]
        if 'images' in canv:
            img_dict = canv['images'][0]
            img_url = img_dict['resource']['service']['@id']

            # add image formatting params
            img_url += '/' if img_url[-1] != '/' else ''
            # region/w,h/rotation/quality.format
            # (scales the height proportionally)
            img_url += f'full/{image_width},/0/default.jpg'
            return img_url
    return None


def chat_gpt_address_from_txt(title: str, description: str = None, openai_key: str = None) -> Tuple[str, str]:
    # openai.api_key = os.getenv("OPENAI_API_KEY")
    openai.api_key = openai_key
    prompt_template = """
            Geef een adres in de stad Gent die een relatie heeft met een object met deze omschrijving. En waarom.\n
            Titel: %s\n
            %s
            Adres: \n
            """
    prompt = prompt_template % (
        title, "Omschrijving: %s\n" % description if description is not None else ''
    )
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0,
        max_tokens=974,
        top_p=1,
        frequency_penalty=0.5,
        presence_penalty=0
    )
    answer_txt = response['choices'][0]['text']
    address, explanation = answer_txt.split('\n\n')[0], '\n'.join(answer_txt.split('\n\n')[1:])
    return address, explanation


def payload_from_obj_and_coords(obj_id, coords, title, desc, address, img_url, link, tags=None) -> Dict[str, Any]:
    payload = {
        "object_id": obj_id,
        "title": title,
        "coordinates": coords,
        "description": desc,
        "address": address,
        "image_url": img_url,
        "location_link": link,
        # "tags": ["19e eeuw", "lol"]
    }
    if tags is not None:
        payload['tags'] = tags
    return payload


def coordinates_from_address(address: str, maps_client: googlemaps.client.Client) \
        -> Tuple[Optional[Tuple[float, float]], str]:
    geocode_result = maps_client.geocode(address)
    if len(geocode_result) > 0:
        loc = geocode_result[0]['geometry']['location']
        lat, lon = loc['lat'], loc['lng']
        return (lat, lon), geocode_result[0]['formatted_address']
    return None, address


def gpt_payload_from_object(obj_id: str, obj: Dict, openai_key: str, maps_client: googlemaps.client.Client) -> Optional[Dict]:
    # {
    #     'object_id': obj_id,
    #     'title': obj['MensgemaaktObject.titel']['@value'],
    #     'description': obj.get('Entiteit.beschrijving', {}).get('@value', ''),
    # }
    try:
        title = obj['MensgemaaktObject.titel']['@value']
        desc = obj.get('Entiteit.beschrijving', {}).get('@value', '')
        address, explanation = chat_gpt_address_from_txt(title, desc, openai_key)
        coords, formatted_address = coordinates_from_address(address, maps_client)
        img_url = get_img_url_from_obj(obj, image_width=400)
        # todo in_center, see in_center_to_db.py file
        if coords is not None:
            payload_desc = desc + '\n' + explanation
            payload = payload_from_obj_and_coords(obj_id, coords, title, payload_desc, formatted_address, img_url,
                                                  'ChatGPT')
            return payload
    except Exception as e:
        print(e)
        # raise e
        return None
