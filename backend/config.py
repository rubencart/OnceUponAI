from pydantic import BaseSettings


class Settings(BaseSettings):
    gent_hoods_shp_file: str = ""
    openai_key: str = ""
    google_maps_key: str = ""
    approx_nn_file: str = ""

    class Config:
        env_file = "./config/.env"
