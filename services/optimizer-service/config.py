# Upstream services
DISPERSION_ENGINE_URL = "http://localhost:8002"

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
