import json
import os
from typing import List, Dict

DATA_FILE = os.path.join(os.path.dirname(__file__), "../data/cities.json")

def get_cities() -> List[Dict]:
    """
    Returns the list of configured city presets.
    """
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Warning: Cities data file not found at {DATA_FILE}")
        return []

def get_city_by_id(city_id: str) -> Dict:
    """
    Returns a specific city by its ID.
    """
    cities = get_cities()
    for city in cities:
        if city["id"] == city_id:
            return city
    return None
