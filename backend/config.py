from pydantic import BaseSettings


class Settings(BaseSettings):
    gent_hoods_shp_file: str = ""

    class Config:
        env_file = "./config/.env"
