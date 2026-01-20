import json
import os

BUCKET_NAME = os.getenv("BUCKET_NAME", "urban-carbon-city-data")

def load_geojson(path: str):
    """
    path examples:
    - raw/roads.geojson
    - raw/buildings.geojson
    - processed/grids.geojson
    """
    from google.cloud import storage
    
    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(path)

    data = blob.download_as_text()
    return json.loads(data)
