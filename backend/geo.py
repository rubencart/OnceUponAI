from typing import List

import geopandas as gpd
import pandas as pd
from shapely import Point


class CenterFilter:
    CENTER_HOODS = [
        'Binnenstad',
        'Ledeberg',
        'Dampoort',
        'Bloemekenswijk',
        'Rabot - Blaisantvest',
        'Oud Gentbrugge',
        'Gentse Kanaaldorpen en -zone',
        'Sluizeken - Tolhuis - Ham',
        'Muide - Meulestede - Afrikalaan',
        'Macharius - Heirnis',
        'Stationsbuurt-Noord',
        'Elisabethbegijnhof - Prinsenhof - Papegaai - Sint-Michiels',
    ]

    def __init__(self, shp_file: str):
        """
            https://data.stad.gent/explore/dataset/stadswijken-gent/table/
        :param shp_file:
        """
        self.hoods = gpd.read_file(shp_file)
        self.center_hoods = self.hoods.loc[self.hoods['wijk'].isin(self.CENTER_HOODS)]

    def is_in_center(self, coords: List[float]) -> bool:
        return bool(pd.Series.any(
            self.center_hoods['geometry'].contains(Point(coords[1], coords[0]))
        ))
