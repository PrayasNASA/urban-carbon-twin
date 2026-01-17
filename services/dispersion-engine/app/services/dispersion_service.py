import requests
from app.models.state import GridState
from config import (
    GIS_BASE_URL,
    EMISSION_ENGINE_URL,
    DIFFUSION_FACTOR,
    DECAY_FACTOR,
    TIME_STEPS
)


def fetch_adjacency():
    r = requests.get(f"{GIS_BASE_URL}/city/adjacency")
    r.raise_for_status()
    return r.json()["adjacency"]


def fetch_emissions():
    r = requests.get(f"{EMISSION_ENGINE_URL}/emissions")
    r.raise_for_status()
    data = r.json()["emissions"]
    return {e["grid_id"]: e["emission"] for e in data}


def simulate_dispersion(adjacency, emissions):
    state = emissions.copy()

    for _ in range(TIME_STEPS):
        new_state = state.copy()

        for grid_id, value in state.items():
            neighbors = adjacency.get(grid_id, [])
            if not neighbors:
                continue

            spread_amount = value * DIFFUSION_FACTOR
            per_neighbor = spread_amount / len(neighbors)

            new_state[grid_id] -= spread_amount

            for n in neighbors:
                new_state[n] += per_neighbor

        # Natural decay
        for g in new_state:
            new_state[g] *= (1 - DECAY_FACTOR)

        state = new_state

    return state
