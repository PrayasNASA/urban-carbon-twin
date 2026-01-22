
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random

router = APIRouter()

class SimulationRequest(BaseModel):
    lat: float
    lon: float

class GridResult(BaseModel):
    grid_id: str
    concentration: float
    
class DispersionData(BaseModel):
    results: List[GridResult]

class SimulationResponse(BaseModel):
    dispersion: DispersionData
    optimization_plan: Optional[dict] = None


from app.services.gee_service import get_co2_data

@router.post("/initialize", response_model=SimulationResponse)
def initialize_simulation(req: SimulationRequest):
    # Fetch real data for the location
    real_data = get_co2_data(req.lat, req.lon)
    
    # Baseline concentration for the grid
    # Default to 0.04 (approx global avg) if no data or error
    base_val = 0.04
    
    if real_data and "value" in real_data:
        base_val = real_data["value"]
    
    # Scale up for visualization if the value is raw mol/m^2 (usually small like 0.03)
    # The frontend expects values around 0-100 or 0-1000 for color mapping?
    # Looking at CityGrid.tsx: `intensity = Math.min(g.concentration / 100, 1);`
    # So values around 0-100 are expected.
    # Sentinel-5P CO is ~0.03 mol/m^2. Let's scale it up to be visible in the 0-100 range.
    # 0.03 * 2000 = 60.
    
    display_base = base_val * 2000
    
    results = []
    # Generate a 20x20 grid (400 nodes)
    for i in range(400):
        # Generate some concentration values
        # Distribute based on a 'heat' map around the center or just random variation
        # Let's create a bit of a hotspot in the middle for 'realism'
        
        # Grid coordinates 20x20
        x = i % 20
        y = i // 20
        
        # Distance from center (10, 10)
        dist = ((x - 10)**2 + (y - 10)**2)**0.5
        
        # Higher concentration in center
        local_concentration = display_base * (1 + (10 - dist)/20) 
        
        # Add random noise
        local_concentration += random.uniform(-display_base*0.1, display_base*0.1)
        
        results.append(GridResult(
            grid_id=f"G-{i:03d}",
            concentration=max(0, local_concentration)
        ))
        

    # Mock optimization plan based on the generated grid
    mock_plan = []
    budget_used = 0
    interventions = ["carbon_capture_v1", "algae_bio_panel", "urban_reforestation", "direct_air_capture"]
    
    # Generate deployment actions for highest concentration grids
    high_concentration_grids = sorted(results, key=lambda x: x.concentration, reverse=True)
    
    for i, grid in enumerate(high_concentration_grids[:8]): # Pick top 8 hot zones
        cost = random.randint(2000, 8000)
        reduction = grid.concentration * 0.15 # Mock reduction
        
        mock_plan.append({
            "grid_id": grid.grid_id,
            "intervention": random.choice(interventions),
            "units": random.randint(1, 5),
            "cost": cost,
            "expected_reduction": reduction
        })
        budget_used += cost

    return SimulationResponse(
        dispersion=DispersionData(results=results),
        optimization_plan={
            "status": "Optimization Online",
            "solver": "V4.2",
            "target": "Carbon Neutral 2040",
            "total_budget": 50000,
            "budget_used": budget_used,
            "plan": mock_plan
        }
    )


