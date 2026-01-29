import requests
from config import GIS_BASE_URL

def calculate_policy_impacts():
    """
    Calculates dynamic CO2 reduction percentages for policies based on actual city GIS data.
    """
    try:
        # 1. Fetch live grid metadata from GIS Service
        r = requests.get(f"{GIS_BASE_URL}/city/grids")
        r.raise_for_status()
        grids = r.json()
        
        if not grids:
            return []

        # 2. Extract spatial metrics
        total_road_length = sum(g.get("road_length", 0) for g in grids)
        total_buildings = sum(g.get("building_count", 0) for g in grids)
        avg_building_height = sum(g.get("avg_building_height", 0) for g in grids) / len(grids)

        # 3. Dynamic Policy Logic
        # Impact = Base Impact * (Spatial Density Factor)
        
        # Policy A: EV-Only Zone (Dependent on Road Density)
        # We assume 1.0 road units per grid is 'nominal'. Higher density means higher policy leverage.
        road_factor = min(1.5, max(0.5, total_road_length / (len(grids) * 0.1)))
        ev_impact = 10.0 * road_factor

        # Policy B: Green Roof Mandate (Dependent on Building Count & Height)
        # High building count = more surface area for green roofs.
        building_factor = min(1.8, max(0.4, total_buildings / (len(grids) * 5)))
        height_factor = min(1.2, max(0.8, avg_building_height / 12.0))
        green_roof_impact = 7.0 * building_factor * height_factor

        # Policy C: Industrial Carbon Tax (Deterministic Baseline with slight spatial variance)
        # Assuming higher building density correlates with higher localized industrial activity for this simulation.
        tax_impact = 14.0 * (building_factor * 0.8 + 0.2)

        # Policy D: Public Transit Expansion
        cycle_impact = 5.0 * (road_factor * 1.2)

        return [
            { "id": "ev_zone", "impact_co2": round(ev_impact, 1) },
            { "id": "green_roof", "impact_co2": round(green_roof_impact, 1) },
            { "id": "carbon_tax", "impact_co2": round(tax_impact, 1) },
            { "id": "public_transit", "impact_co2": round(cycle_impact, 1) }
        ]

    except Exception as e:
        print(f"Policy Impact Calculation Failed: {e}")
        # Return fallback "safe" values if engine fails
        return [
            { "id": "ev_zone", "impact_co2": 10.0 },
            { "id": "green_roof", "impact_co2": 7.0 },
            { "id": "carbon_tax", "impact_co2": 15.0 },
            { "id": "public_transit", "impact_co2": 5.0 }
        ]
