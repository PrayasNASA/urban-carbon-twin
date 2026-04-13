import os
import shutil
import glob

# Source directories
services_dir = "d:\\Projects\\urban-carbon-twin\\services"
gateway_dir = os.path.join(services_dir, "api-gateway")

engines = [
    "emission-engine",
    "dispersion-engine",
    "optimizer-service",
    "intervention-engine",
    "gis-service"
]

# Copy all service scripts into api-gateway/app/services
for engine in engines:
    src_services = os.path.join(services_dir, engine, "app", "services")
    if os.path.exists(src_services):
        for f in glob.glob(os.path.join(src_services, "*.py")):
            if not f.endswith("__init__.py"):
                shutil.copy(f, os.path.join(gateway_dir, "app", "services"))

# Copy all models if any
for engine in engines:
    src_models = os.path.join(services_dir, engine, "app", "models")
    if os.path.exists(src_models):
        target_models = os.path.join(gateway_dir, "app", "models")
        os.makedirs(target_models, exist_ok=True)
        for f in glob.glob(os.path.join(src_models, "*.py")):
            if not f.endswith("__init__.py"):
                shutil.copy(f, target_models)

print("Modules copied to api-gateway.")
