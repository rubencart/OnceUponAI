from pydantic import BaseSettings


class Settings(BaseSettings):
    gent_hoods_shp_file: str = ""
    openai_key: str = ""
    google_maps_key: str = ""
    approx_nn_file: str = ""
    mongo_uri: str = ""
    do_spaces_secret: str = ""
    do_spaces_access: str = ""
    do_spaces_uri: str = ""

    class Config:
        env_file = "./config/.env"
