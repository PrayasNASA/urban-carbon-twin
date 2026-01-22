
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

@router.post("/initialize", response_model=SimulationResponse)
def initialize_simulation(req: SimulationRequest):
    # Mock simulation logic
    # In a real app, this would query a geospatial DB or run a physics model
    
    results = []
    # Generate a 20x20 grid (400 nodes) as implied by the UI "NODES: 400"
    for i in range(400):
        # Generate some concentration values with a "hotspot" logic or just random
        # Using a simple random distribution for now with some spatial coherence illusion
        base_concentration = 400 + random.uniform(-50, 100)
        
        # Add some "hotspots"
        if i % 23 == 0:
            base_concentration += 200
            
        results.append(GridResult(
            grid_id=f"G-{i:03d}",
            concentration=base_concentration
        ))
        
    return SimulationResponse(
        dispersion=DispersionData(results=results),
        optimization_plan={
            "status": "Optimization Online",
            "solver": "V4.2",
            "target": "Carbon Neutral 2040"
        }
    )
