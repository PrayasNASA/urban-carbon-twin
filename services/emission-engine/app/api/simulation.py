
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import math

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
    # Fallback to a global average if no data or error
    base_val = 0.04
    
    if real_data and "value" in real_data:
        base_val = real_data["value"]
    
    # Scale up for visualization if the value is raw mol/m^2 (usually small like 0.03)
    display_base = base_val * 2000
    
    results = []
    # Generate a 20x20 grid (400 nodes)
    for i in range(400):
        # Generate some concentration values
        # Distribute based on a 'heat' map around the center
        # Deterministic simulation model
        
        # Grid coordinates 20x20
        x = i % 20
        y = i // 20
        
        # Distance from center (10, 10)
        dist = ((x - 10)**2 + (y - 10)**2)**0.5
        
        # Higher concentration in center
        local_concentration = display_base * (1 + (10 - dist)/20) 
        
        # Add deterministic variation (texture) instead of random noise
        # Use sine waves based on grid position to create 'plumes'
        variation = math.sin(x * 0.5) * math.cos(y * 0.5) * (display_base * 0.05)
        local_concentration += variation
        
        results.append(GridResult(
            grid_id=f"G-{i:03d}",
            concentration=max(0, local_concentration)
        ))
        

    # Deployment plan based on the generated grid
    deployment_plan = []
    budget_used = 0
    
    # Deterministic deployment actions based on concentration
    high_concentration_grids = sorted(results, key=lambda x: x.concentration, reverse=True)
    
    intervention_catalog = {
        "direct_air_capture": {"threshold": 90.0, "base_cost": 8000, "efficiency": 0.25},
        "carbon_capture_v1": {"threshold": 70.0, "base_cost": 5000, "efficiency": 0.18},
        "algae_bio_panel": {"threshold": 50.0, "base_cost": 3000, "efficiency": 0.12},
        "urban_reforestation": {"threshold": 0.0, "base_cost": 1500, "efficiency": 0.08}
    }

    for i, grid in enumerate(high_concentration_grids[:8]): # Pick top 8 hot zones
        val = grid.concentration
        selected_intervention = "urban_reforestation"
        
        # Select intervention based on severity
        if val > intervention_catalog["direct_air_capture"]["threshold"]:
            selected_intervention = "direct_air_capture"
        elif val > intervention_catalog["carbon_capture_v1"]["threshold"]:
            selected_intervention = "carbon_capture_v1"
        elif val > intervention_catalog["algae_bio_panel"]["threshold"]:
            selected_intervention = "algae_bio_panel"
            
        specs = intervention_catalog[selected_intervention]
        
        # Calculate units needed (higher concentration = more units, capped at 10)
        units = min(10, max(1, int(val / 20)))
        
        # Calculate cost and reduction
        cost = specs["base_cost"] * units
        reduction = val * specs["efficiency"] * (1 + (units * 0.1)) # Diminishing returns or scaling
        
        deployment_plan.append({
            "grid_id": grid.grid_id,
            "intervention": selected_intervention,
            "units": units,
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
            "plan": deployment_plan
        }
    )


