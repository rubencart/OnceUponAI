from functools import lru_cache

import boto3
import botocore

import config


@lru_cache()
def get_settings() -> config.Settings:
    return config.Settings()


def obj_to_str(obj, add_descr=True):
    res = obj['title']
    if add_descr and obj['description'].strip() != '':
        res += f". {obj['description']}"
    return res


async def download_ann_file():
    session = boto3.session.Session()
    client = session.client('s3',
                            config=botocore.config.Config(s3={'addressing_style': 'virtual'}),
                            region_name='fra1',
                            endpoint_url=get_settings().do_spaces_uri,
                            aws_access_key_id=get_settings().do_spaces_access,
                            aws_secret_access_key=get_settings().do_spaces_secret,
                            )
    client.download_file('onceuponai-backend-files',
                         'test.ann',
                         get_settings().approx_nn_file, )
