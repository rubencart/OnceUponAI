from functools import lru_cache

import config


@lru_cache()
def get_settings() -> config.Settings:
    return config.Settings()


def obj_to_str(obj):
    res = obj['title']
    if obj['description'].strip() != '':
        res += f". {obj['description']}"
    return res
