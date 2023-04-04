import errno
import os
from typing import Dict, Optional


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
