# Internal service endpoints

# GIS_SERVICE = "http://localhost:8000"
# EMISSION_ENGINE = "http://localhost:8001"
# DISPERSION_ENGINE = "http://localhost:8002"
# INTERVENTION_ENGINE = "http://localhost:8003"
# OPTIMIZER_ENGINE = "http://localhost:8004"
# These are now set via environment variables for flexibility


import os

GIS_BASE_URL = os.getenv("GIS_BASE_URL", "http://localhost:8000")
EMISSION_ENGINE_URL = os.getenv("EMISSION_ENGINE_URL", "http://localhost:8001")
DISPERSION_ENGINE_URL = os.getenv("DISPERSION_ENGINE_URL", "http://localhost:8002")
INTERVENTION_ENGINE_URL = os.getenv("INTERVENTION_ENGINE_URL", "http://localhost:8003")
OPTIMIZER_ENGINE_URL = os.getenv("OPTIMIZER_ENGINE_URL", "http://localhost:8004")
GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT", "urbun-carbon-twin")
GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")


# --- Merged Constants ---


import os

GIS_BASE_URL = os.getenv(
    "GIS_BASE_URL",
    "http://localhost:8000"
)

EMISSION_ENGINE_URL = os.getenv(
    "EMISSION_ENGINE_URL",
    "http://localhost:8001"
)

# # Service endpoints
# GIS_BASE_URL = "http://localhost:8000"
# EMISSION_ENGINE_URL = "http://localhost:8001"

# Dispersion parameters
DIFFUSION_FACTOR = 0.15   # % spread to neighbors per step
DECAY_FACTOR = 0.02       # natural loss per step
TIME_STEPS = 5            # simulation iterations


# Emission factors (planning-grade)

TRAFFIC_EMISSION_FACTOR = 0.25   # kg CO2 per meter of road
RESIDENTIAL_EMISSION_FACTOR = 0.8  # kg CO2 per building
INDUSTRIAL_EMISSION_FACTOR = 5.0   # kg CO2 per grid (baseline)

# GIS Service endpoint
# GIS_BASE_URL = "http://localhost:8000"

import os

GIS_BASE_URL = os.getenv(
    "GIS_BASE_URL",
    "http://localhost:8000"
)

# Upstream services
# DISPERSION_ENGINE_URL = "http://localhost:8002"

import os

DISPERSION_ENGINE_URL = os.getenv(
    "DISPERSION_ENGINE_URL",
    "http://localhost:8002"
)


# Default intervention efficiencies (fractional reduction)
INTERVENTION_LIBRARY = {
    "roadside_capture": {
        "efficiency": 0.25,   # 25% reduction
        "max_units_per_grid": 3
    },
    "vertical_garden": {
        "efficiency": 0.15,
        "max_units_per_grid": 5
    },
    "biofilter": {
        "efficiency": 0.20,
        "max_units_per_grid": 2
    }
}

import os

DISPERSION_ENGINE_URL = os.getenv(
    "DISPERSION_ENGINE_URL",
    "http://localhost:8002"
)

INTERVENTION_ENGINE_URL = os.getenv(
    "INTERVENTION_ENGINE_URL",
    "http://localhost:8003"
)


# Upstream services
# DISPERSION_ENGINE_URL = "http://localhost:8002"


# Intervention catalog (cost + efficiency)
INTERVENTIONS = {
    "roadside_capture": {
        "cost_per_unit": 5000,
        "efficiency": 0.25,
        "max_units_per_grid": 3
    },
    "vertical_garden": {
        "cost_per_unit": 3000,
        "efficiency": 0.15,
        "max_units_per_grid": 5
    },
    "biofilter": {
        "cost_per_unit": 8000,
        "efficiency": 0.20,
        "max_units_per_grid": 2
    }
}
