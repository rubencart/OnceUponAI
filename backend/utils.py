from functools import lru_cache

import config


@lru_cache()
def get_settings() -> config.Settings:
    return config.Settings()


def obj_to_str(obj, add_descr=True):
    res = obj['title']
    if add_descr and obj['description'].strip() != '':
        res += f". {obj['description']}"
    return res
