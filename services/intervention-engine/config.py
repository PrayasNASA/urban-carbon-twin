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
