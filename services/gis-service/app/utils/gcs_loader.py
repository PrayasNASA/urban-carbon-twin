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
    try:
        from google.cloud import storage
        
        client = storage.Client()
        bucket = client.bucket(BUCKET_NAME)
        blob = bucket.blob(path)

        data = blob.download_as_text()
        return json.loads(data)
    except Exception as e:
        print(f"⚠️ GCS Load Failed for {path}: {e}")
        # Fallback to local file system
        # Assuming path like 'raw/roads.geojson', map to 'data/raw/roads.geojson'
        
        # Resolve 'data' directory relative to this file (app/utils/gcs_loader.py -> app/../data)
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        local_path = os.path.join(base_dir, "data", path)
        
        print(f"📂 Attempting local load from: {local_path}")
        
        if os.path.exists(local_path):
            with open(local_path, "r") as f:
                return json.load(f)
        else:
            raise FileNotFoundError(f"Could not find file in GCS or local path: {local_path}")
