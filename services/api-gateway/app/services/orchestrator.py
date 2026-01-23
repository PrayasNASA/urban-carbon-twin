import requests
from config import (
    GIS_BASE_URL,
    EMISSION_ENGINE_URL,
    DISPERSION_ENGINE_URL,
    INTERVENTION_ENGINE_URL,
    OPTIMIZER_ENGINE_URL
)


def run_emissions():
    r = requests.get(f"{EMISSION_ENGINE_URL}/emissions")
    r.raise_for_status()
    return r.json()


def run_dispersion():
    r = requests.get(f"{DISPERSION_ENGINE_URL}/dispersion")
    r.raise_for_status()
    return r.json()


def run_optimization(budget: float):
    r = requests.post(
        f"{OPTIMIZER_ENGINE_URL}/optimize",
        json={"budget": budget}
    )
    r.raise_for_status()
    return r.json()


def run_interventions(interventions: list):
    r = requests.post(
        f"{INTERVENTION_ENGINE_URL}/interventions",
        json={"interventions": interventions}
    )
    r.raise_for_status()
    return r.json()


def get_gee_co2(lat: float, lon: float):
    r = requests.get(f"{EMISSION_ENGINE_URL}/api/v1/gee/co2?lat={lat}&lon={lon}")
    r.raise_for_status()
    return r.json()


def init_simulation(lat: float, lon: float, budget: float):
    r = requests.post(
        f"{EMISSION_ENGINE_URL}/simulation/initialize",
        json={"lat": lat, "lon": lon, "budget": budget}
    )
    r.raise_for_status()
    return r.json()
