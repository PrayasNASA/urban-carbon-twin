import requests
from config import DISPERSION_ENGINE_URL, INTERVENTION_LIBRARY


def fetch_dispersion():
    r = requests.get(f"{DISPERSION_ENGINE_URL}/dispersion")
    r.raise_for_status()
    data = r.json()["results"]
    return {d["grid_id"]: d["concentration"] for d in data}


def apply_interventions(concentrations: dict, interventions: list[dict]):
    """
    interventions item format:
    {
        "grid_id": "grid_1_2",
        "type": "roadside_capture",
        "units": 2
    }
    """
    updated = concentrations.copy()

    for action in interventions:
        grid_id = action["grid_id"]
        kind = action["type"]
        units = action["units"]

        if grid_id not in updated:
            continue

        if kind not in INTERVENTION_LIBRARY:
            continue

        config = INTERVENTION_LIBRARY[kind]
        units = min(units, config["max_units_per_grid"])

        # Compound reduction: apply efficiency per unit multiplicatively
        for _ in range(units):
            updated[grid_id] *= (1 - config["efficiency"])

    return updated
