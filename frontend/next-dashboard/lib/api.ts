export const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY || "https://api-gateway-owkex2u2ca-uc.a.run.app";

export async function runScenario(budget: number) {
  const res = await fetch(`${API_GATEWAY}/scenario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ budget }),
  });

  if (!res.ok) {
    throw new Error("Failed to call API Gateway");
  }

  return res.json();
}

export async function compareScenarios(budgetA: number, budgetB: number) {
  const res = await fetch(`${API_GATEWAY}/scenario/compare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scenario_a_budget: budgetA,
      scenario_b_budget: budgetB
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to compare scenarios");
  }

  return res.json();
}





export async function initializeSimulation(lat: number, lon: number, budget: number) {
  // Using Local Emission Engine for verifying the deterministic fix
  // const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY || "https://api-gateway-owkex2u2ca-uc.a.run.app";
  const LOCAL_URL = "http://localhost:8002";

  const res = await fetch(`${LOCAL_URL}/simulation/initialize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lat, lon, budget }),
  });

  if (!res.ok) {

    throw new Error("Failed to initialize simulation");
  }

  return res.json();
}

