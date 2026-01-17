import requests
from app.models.emission import Emission
from config import (
    GIS_BASE_URL,
    TRAFFIC_EMISSION_FACTOR,
    RESIDENTIAL_EMISSION_FACTOR,
    INDUSTRIAL_EMISSION_FACTOR
)


def fetch_grids():
    response = requests.get(f"{GIS_BASE_URL}/city/grids")
    response.raise_for_status()
    return response.json()


def compute_emissions(grids):
    emissions: list[Emission] = []

    for g in grids:
        traffic_emission = g["road_length"] * TRAFFIC_EMISSION_FACTOR
        residential_emission = g["building_count"] * RESIDENTIAL_EMISSION_FACTOR
        industrial_emission = INDUSTRIAL_EMISSION_FACTOR

        total_emission = (
            traffic_emission +
            residential_emission +
            industrial_emission
        )

        emissions.append(
            Emission(
                grid_id=g["grid_id"],
                value=round(total_emission, 4)
            )
        )

    return emissions
