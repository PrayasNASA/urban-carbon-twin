const API_GATEWAY =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_GATEWAY || "https://api-gateway-916807068717.us-central1.run.app";

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

