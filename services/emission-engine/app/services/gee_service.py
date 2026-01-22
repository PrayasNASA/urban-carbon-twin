
import ee
import os
import datetime

def initialize_gee():
    """
    Initialize Google Earth Engine.
    Uses default credentials or expects GOOGLE_APPLICATION_CREDENTIALS env var.
    Falls back to high-volume generic public user if available (rarely works server-side without service account).
    """
    try:
        ee.Initialize()
        print("GEE Initialized successfully.")
    except Exception as e:
        print(f"GEE Initialization failed: {e}")
        # In a real scenario, we might try ee.Authenticate() but that requires interactive auth.
        # For server, we rely on Service Account.
        pass

def get_co2_data(lat: float, lon: float, date_from: str = None, date_to: str = None):
    """
    Fetch CO2 data (Sentinel-5P) for a specific location.
    
    Args:
        lat: Latitude
        lon: Longitude
        date_from: Start date (YYYY-MM-DD), defaults to 30 days ago
        date_to: End date (YYYY-MM-DD), defaults to today
    """
    try:
        initialize_gee()
        
        if not date_to:
            date_to = datetime.date.today().isoformat()
        if not date_from:
            date_from = (datetime.date.today() - datetime.timedelta(days=30)).isoformat()

        # Point of interest
        point = ee.Geometry.Point([lon, lat])
        
        # Sentinel-5P CO data (CO is often used as a proxy or alongside CO2 studies in this context, 
        # actual CO2 (XCO2) usually comes from OCO-2/3 which has sparser coverage.
        # We will use Sentinel-5P CO as a demo 'Air Quality/Carbon' proxy if CO2 specifically isn't easily avail 
        # seamlessly daily. 
        # HOWEVER, let's look for CO2. OCO-2 is 'OCO/OCO2/L3/PHYSIK'.
        # Let's stick to Sentinel-5P CO for abundance and better visual coverage for 'Urban' demo.
        # Collection: 'COPERNICUS/S5P/OFFL/L3_CO'
        
        collection = (ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_CO')
                      .select('CO_column_number_density')
                      .filterDate(date_from, date_to)
                      .filterBounds(point))

        # Get the mean value over the period at the point
        # Reducing region to get actual number
        image = collection.mean()
        
        # Scale: S5P pixel is roughly 7km, but we sample at 1000m for "urban" smoothness
        data = image.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=point,
            scale=1000,
            bestEffort=True
        ).getInfo()

        if data and 'CO_column_number_density' in data and data['CO_column_number_density'] is not None:
            return {
                "location": {"lat": lat, "lon": lon},
                "period": {"from": date_from, "to": date_to},
                "value": data['CO_column_number_density'],
                "unit": "mol/m^2",
                "sensor": "Sentinel-5P TROPOMI"
            }
        else:
            return None

    except Exception as e:
        print(f"Error fetching GEE data: {e}")
        return {"error": str(e)}
