from shapely.geometry import Polygon
from math import cos, radians
from app.models.grid import Grid

LAT_MIN = 28.540
LAT_MAX = 28.560
LON_MIN = 77.180
LON_MAX = 77.200
GRID_SIZE_METERS = 200


def _meters_to_lat(meters: float) -> float:
    return meters / 111000


def _meters_to_lon(meters: float, latitude: float) -> float:
    return meters / (111000 * cos(radians(latitude)))


def generate_grids() -> list[Grid]:
    grids: list[Grid] = []

    lat_step = _meters_to_lat(GRID_SIZE_METERS)
    mean_lat = (LAT_MIN + LAT_MAX) / 2
    lon_step = _meters_to_lon(GRID_SIZE_METERS, mean_lat)

    row = 0
    lat = LAT_MIN

    while lat < LAT_MAX:
        col = 0
        lon = LON_MIN

        while lon < LON_MAX:
            polygon = Polygon([
                (lon, lat),
                (lon + lon_step, lat),
                (lon + lon_step, lat + lat_step),
                (lon, lat + lat_step)
            ])

            grid = Grid(
                grid_id=f"grid_{row}_{col}",
                polygon=polygon
            )

            grids.append(grid)
            lon += lon_step
            col += 1

        lat += lat_step
        row += 1

    return grids
