# Internal service endpoints

# GIS_SERVICE = "http://localhost:8000"
# EMISSION_ENGINE = "http://localhost:8001"
# DISPERSION_ENGINE = "http://localhost:8002"
# INTERVENTION_ENGINE = "http://localhost:8003"
# OPTIMIZER_ENGINE = "http://localhost:8004"


import os

GIS_BASE_URL = os.getenv("GIS_BASE_URL", "http://localhost:8000")
EMISSION_ENGINE_URL = os.getenv("EMISSION_ENGINE_URL", "http://localhost:8001")
DISPERSION_ENGINE_URL = os.getenv("DISPERSION_ENGINE_URL", "http://localhost:8002")
INTERVENTION_ENGINE_URL = os.getenv("INTERVENTION_ENGINE_URL", "http://localhost:8003")
OPTIMIZER_ENGINE_URL = os.getenv("OPTIMIZER_ENGINE_URL", "http://localhost:8004")
