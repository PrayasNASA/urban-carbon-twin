import sys
import os
import json

# Add service paths to sys.path to simulate running from root
sys.path.append(os.path.abspath("services/api-gateway"))
sys.path.append(os.path.abspath("services/gis-service"))
sys.path.append(os.path.abspath("services/dispersion-engine"))

def check_env():
    print("\n[1] Checking Environment Configuration...")
    # Manual .env loading for verification script context
    env_path = os.path.abspath("services/api-gateway/.env")
    if os.path.exists(env_path):
        print(f"   Loading .env from {env_path}")
        with open(env_path, "r") as f:
            for line in f:
                if "=" in line and not line.strip().startswith("#"):
                    k, v = line.strip().split("=", 1)
                    if k and not os.getenv(k):
                        os.environ[k] = v

    required = ["OPENWEATHER_API_KEY", "GOOGLE_CLOUD_PROJECT"]
    missing = []
    # Load .env.example keys as a reference for what should exist
    for key in required:
        if not os.getenv(key):
            missing.append(key)
    
    if missing:
        print(f"⚠️  WARNING: Missing Environment Variables: {', '.join(missing)}")
        print("   Live features will fail without these.")
    else:
        print("✅ Environment variables look good (based on checking presence).")

def check_cities():
    print("\n[2] Verifying City Presets (GIS Service)...")
    try:
        from app.services.city_service import get_cities
        cities = get_cities()
        print(f"✅ Loaded {len(cities)} city presets.")
        names = [c['name'] for c in cities]
        print(f"   Cities: {', '.join(names)}")
        
        expected = ["New Delhi", "New York City", "London", "Singapore"]
        if all(e in names for e in expected):
            print("✅ All target major cities present.")
        else:
            print("⚠️  Missing some expected cities.")
    except Exception as e:
        print(f"❌ Failed to load cities: {e}")

def check_pdf_generation():
    print("\n[3] Verifying PDF Generation (API Gateway)...")
    try:
        from app.services.pdf_service import create_report_pdf
        
        dummy_analysis = {
            "summary": "System verified successfully.",
            "justification": "All tests passed.",
            "insight": "Deployment ready.",
            "confidence": 0.99
        }
        dummy_params = {"budget": 50000, "city": "Test City"}
        
        pdf_bytes = create_report_pdf(dummy_analysis, dummy_params)
        
        if len(pdf_bytes) > 1000:
             print(f"✅ PDF generated successfully ({len(pdf_bytes)} bytes).")
        else:
             print("⚠️  PDF generated but seems too small.")
    except Exception as e:
        print(f"❌ PDF Generation failed: {e}")

def check_imports():
    print("\n[4] Verifying Service Imports...")
    modules = [
        "app.services.weather_service",
        "app.services.orchestrator",
        "app.api.scenarios",
    ]
    
    for mod in modules:
        try:
            __import__(mod)
            print(f"✅ Imported {mod}")
        except Exception as e:
            print(f"❌ Failed to import {mod}: {e}")

if __name__ == "__main__":
    print("=== Urban Carbon Twin System Verification ===")
    check_env()
    check_cities()
    check_pdf_generation()
    check_imports()
    print("\n=== Verification Complete ===")
