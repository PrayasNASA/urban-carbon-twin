from fastapi import APIRouter
from app.schemas.scenario_schema import ScenarioRequest, ScenarioResponse, ComparisonRequest
from app.services.orchestrator import (
    run_emissions,
    run_dispersion,
    run_optimization,
    run_interventions,
    get_gee_co2,
    init_simulation,
    analyze_scenario,
    get_market_pulse
)
from app.services.policy_service import calculate_policy_impacts
import os
from fastapi import Query

def _get_mitigation_map(plan_data):
    """Helper to run interventions and get the visual map data"""
    if not plan_data or "plan" not in plan_data:
        return []
    
    interventions = [
        {
            "grid_id": item["grid_id"],
            "type": item["intervention"],
            "units": item["units"]
        }
        for item in plan_data["plan"]
    ]
    
    if not interventions:
        return []
        
    return run_interventions(interventions)

router = APIRouter(prefix="/scenario", tags=["Scenario"])


@router.post("", response_model=ScenarioResponse)
def run_scenario(payload: ScenarioRequest):
    print(f"🚀 Running full simulation scenario with budget: {payload.budget}")
    
    try:
        # 1. Start with baseline emissions
        emissions_data = run_emissions()
        
        # 2. Simulate baseline dispersion
        dispersion_data = run_dispersion()
        
        # 3. Compute optimal intervention plan based on budget
        optimization_data = run_optimization(payload.budget)
        
        # 4. Apply interventions to see post-mitigation concentrations
        # We use the plan from optimization to run interventions
        interventions_to_apply = []
        if optimization_data and "plan" in optimization_data:
             interventions_to_apply = [
                {
                    "grid_id": item["grid_id"],
                    "type": item["intervention"],
                    "units": item["units"]
                }
                for item in optimization_data["plan"]
            ]
        
        post_intervention_data = None
        if interventions_to_apply:
            post_intervention_data = run_interventions(interventions_to_apply)

        return {
            "emissions": emissions_data,
            "dispersion": dispersion_data,
            "optimization_plan": optimization_data,
            "post_intervention": post_intervention_data
        }
    except Exception as e:
        print(f"Error executing scenario: {e}")
        # Return a partial response or handle gracefully (in a real app, raise HTTP 500)
        return {
            "emissions": {},
            "dispersion": {},
            "optimization_plan": {"error": str(e)},
            "post_intervention": {}
        }


@router.post("/compare")
def compare_scenarios(payload: ComparisonRequest):
    """
    Compare two different budget scenarios to see the marginal gain.
    """
    print(f"⚖️ Comparing Scenarios: ${payload.scenario_a_budget} vs ${payload.scenario_b_budget}")
    
    try:
        # We only need to run optimization for both, assuming baseline is same
        plan_a = run_optimization(payload.scenario_a_budget)
        plan_b = run_optimization(payload.scenario_b_budget)
        
        return {
            "scenario_a": {
                "budget": payload.scenario_a_budget,
                "impact": plan_a.get("total_reduction", 0) if plan_a else 0,
                "plan": {
                    **plan_a,
                    "post_mitigation": _get_mitigation_map(plan_a)
                }
            },
            "scenario_b": {
                "budget": payload.scenario_b_budget,
                "impact": plan_b.get("total_reduction", 0) if plan_b else 0,
                "plan": {
                    **plan_b,
                    "post_mitigation": _get_mitigation_map(plan_b)
                }
            },
            "insight": f"Scenario B reduces {(plan_b.get('total_reduction', 0) - plan_a.get('total_reduction', 0)):.2f} more units of AQI."
        }
    except Exception as e:
        return {"error": str(e)}


@router.get("/gee/co2")
def get_gee_data(lat: float = Query(...), lon: float = Query(...)):
    try:
        return get_gee_co2(lat, lon)
    except Exception as e:
        return {"error": str(e)}


@router.post("/simulation/initialize")
def initialize_simulation(payload: dict):
    try:
        from app.services.orchestrator import run_full_simulation
        return run_full_simulation(
            payload.get("lat"), 
            payload.get("lon"), 
            payload.get("budget"),
            payload.get("initial_aqi")
        )
    except Exception as e:
        return {"error": str(e)}


@router.post("/analyze")
def analyze_results(payload: dict):
    """
    Get AI-driven insights for a set of simulation results.
    """
    try:
        return analyze_scenario(payload)
    except Exception as e:
        return {"error": str(e)}


@router.get("/economy/market-pulse")
def market_pulse():
    """
    Get current carbon market prices and trends.
    """
    try:
        return get_market_pulse()
    except Exception as e:
        return {"error": str(e)}


@router.get("/policies/analyze")
def analyze_policies(lat: float = Query(None), lon: float = Query(None)):
    """
    Get dynamic, GIS-informed CO2 reduction impacts for urban policies.
    """
    try:
        return calculate_policy_impacts(lat, lon)
    except Exception as e:
        return {"error": str(e)}


@router.post("/analyze/export")
def export_analysis_pdf(payload: dict):
    """
    Export the analysis as a PDF report.
    Expects JSON payload with 'analysis' and optional 'scenario_params'.
    """
    try:
        from app.services.pdf_service import create_report_pdf
        from fastapi.responses import Response
        
        analysis = payload.get("analysis", {})
        params = payload.get("scenario_params", {})
        
        pdf_bytes = bytes(create_report_pdf(analysis, params))
        print(f"DEBUG: Generated PDF bytes, length: {len(pdf_bytes)}")
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=carbon_twin_report.pdf",
                "Content-Length": str(len(pdf_bytes))
            }
        )
    except Exception as e:
        import traceback
        print(f"ERROR in export_analysis_pdf: {e}")
        print(traceback.format_exc())
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))
