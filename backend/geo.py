import json
from typing import List, Any, Dict, Tuple

import geopandas as gpd
import googlemaps
import pandas as pd
from shapely import Point


class Coordinates:
    lat: float
    lon: float

    def __init__(self, lat: float, lon: float):
        self.lat = lat
        self.lon = lon

    def tup(self):
        return self.lat, self.lon


async def find_shortest_route(gmaps: googlemaps.Client, objs: List[Dict[str, Any]],
                              cur_location: Coordinates) -> List[Dict[str, Any]]:
    obj_locations = [obj['coordinates'] for obj in objs]
    # dist_matrix_resp = gmaps.distance_matrix([cur_location.tup()], locations, mode='walking')
    # print(json.dumps(dist_matrix_resp, indent=2))
    # furthest_loc
    directions = gmaps.directions(origin=cur_location.tup(), destination=cur_location.tup(),
                                  waypoints=obj_locations, optimize_waypoints=True, mode="walking")

    # print(json.dumps(directions, indent=2))
    print(directions[0]['waypoint_order'])
    print('ok')
    return directions


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

    def __call__(self, coords: List[float]) -> bool:
        return bool(pd.Series.any(
            self.center_hoods['geometry'].contains(Point(coords[1], coords[0]))
        ))
