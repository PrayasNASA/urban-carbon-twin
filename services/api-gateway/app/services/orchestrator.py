import requests
from config import (
    GIS_SERVICE,
    EMISSION_ENGINE,
    DISPERSION_ENGINE,
    INTERVENTION_ENGINE,
    OPTIMIZER_ENGINE
)


def run_emissions():
    r = requests.get(f"{EMISSION_ENGINE}/emissions")
    r.raise_for_status()
    return r.json()


def run_dispersion():
    r = requests.get(f"{DISPERSION_ENGINE}/dispersion")
    r.raise_for_status()
    return r.json()


def run_optimization(budget: float):
    r = requests.post(
        f"{OPTIMIZER_ENGINE}/optimize",
        json={"budget": budget}
    )
    r.raise_for_status()
    return r.json()


def run_interventions(interventions: list):
    r = requests.post(
        f"{INTERVENTION_ENGINE}/interventions",
        json={"interventions": interventions}
    )
    r.raise_for_status()
    return r.json()
