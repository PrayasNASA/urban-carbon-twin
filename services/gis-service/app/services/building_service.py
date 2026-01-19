import geopandas as gpd
from app.models.grid import Grid
from app.utils.gcs_loader import load_geojson

DEFAULT_FLOOR_HEIGHT = 3.0  # meters


def load_buildings():
    """
    Loads buildings from Google Cloud Storage instead of local filesystem.
    """
    geojson = load_geojson("raw/buildings.geojson")

    # Convert GeoJSON to GeoDataFrame
    gdf = gpd.GeoDataFrame.from_features(geojson["features"])
    gdf = gdf.set_crs(epsg=4326, allow_override=True)

    # Normalize height
    def extract_height(row):
        if "height" in row and row["height"]:
            return float(row["height"])
        if "building:levels" in row and row["building:levels"]:
            return float(row["building:levels"]) * DEFAULT_FLOOR_HEIGHT
        return DEFAULT_FLOOR_HEIGHT

    gdf["height_m"] = gdf.apply(extract_height, axis=1)
    return gdf


def attach_buildings_to_grids(grids: list[Grid], buildings_gdf):
    """
    Attaches building statistics to each grid.
    """
    for grid in grids:
        intersecting = buildings_gdf[buildings_gdf.intersects(grid.polygon)]

        grid.building_count = len(intersecting)

        if grid.building_count > 0:
            grid.avg_building_height = (
                intersecting["height_m"].sum() / grid.building_count
            )
        else:
            grid.avg_building_height = 0.0

    return grids
