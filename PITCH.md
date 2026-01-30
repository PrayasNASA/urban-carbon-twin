# 🏙️ Urban Carbon Twin - Logic & Layout for the Win

## 1️⃣ The Problem (The Hook)
**"Cities are failing Net Zero commitments because they are flying blind."**

*   **The Gap:** Urban planners today rely on **static, annual PDF reports** to make decisions that impact millions. They cannot "test" a policy before spending billions.
*   **The Pain:** How do you know if an "EV-Only Zone" is better than a "Green Roof Mandate" for *this specific neighborhood*? You don't. You guess.
*   **The Consequence:** Trillions in wasted budget and missed climate targets.

---

## 2️⃣ Our Solution (What we built)
**Meeting the Urban Carbon Twin.**
It is not just a dashboard; it is a **Real-Time Policy Flight Simulator** for city planners.

*   **3D Digital Twin:** High-fidelity visualization of urban infrastructure (using Cesium/Resium).
*   **Live Policy Sandbox:** A powerful engine that allows users to toggle active interventions (Carbon Tax, Green Roofs) and see the *immediate* impact on CO2 emissions and Budget.
*   **AI Strategy Engine:** We don't just show data; our integrated **Vertex AI** agent suggests the *optimal* path to Net Zero based on local grid telemetry.

---

## 3️⃣ Why It’s Different (The "Secret Sauce")
*Most hackathon entries are just "wrappers" around a dataset. We built a specific, logic-driven engine.*

1.  **Granular Logic, Not Generic Averages:**
    *   Our backend (`policy_service.py`) doesn't return static numbers. It fetches **live GIS data** (Road Length, Building Height, Building Count) for the *specific* map tile you are looking at.
    *   *Example:* Toggling "EV Zone" in a high-road-density area yields a higher impact than in a residential zone. That is the power of a Twin.
2.  **Bi-Directional Sync:**
    *   Interact on the Frontend (Next.js) -> Compute on Backend (FastAPI) -> Validate with AI (Vertex).
3.  **Solarpunk Aesthetic:**
    *   We ditched the boring corporate look for a high-end, futuristic "Solarpunk" UI (Tailwind 4 + Glassmorphism) that makes climate action look desirable.

---

## 4️⃣ Live Demo Flow (Script)
*Duration: 2 Minutes*

1.  **The "Wow" Opening (0:00-0:30):**
    *   Launch the app. Show the **3D Globe** spinning and zooming into the specific city grid.
    *   *Narration:* "Welcome to the future of urban planning. This is the live heartbeat of the city's carbon footprint."

2.  **The "Action" (0:30-1:15):**
    *   Open the **Policy Sandbox** on the right panel.
    *   Toggle **"EV-Only Zone"**.
    *   *Point out:* "Watch how the CO2 projection curve bends *instantly*. This isn't a pre-canned number; it's calculating based on the 1,200km of road network in this specific grid."
    *   Toggle **"Industrial Carbon Tax"**. Show the revenue (negative cost) increasing.

3.  **The "Closer" (1:15-2:00):**
    *   Click "Analyze with AI".
    *   Show the **Vertex AI** generating a unique summary: *"Based on high building density in Sector 7, prioritize Green Roofs over Transit expansion."*
    *   *Narration:* "The AI becomes the co-pilot for the Mayor."

---

## 5️⃣ Tech Stack (The Muscle)
*   **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, Cesium (3D Viz).
*   **Backend:** Python (FastAPI), Google Cloud Platform (Cloud Run).
*   **Intelligence:** Google Gemini / Vertex AI (Generative Strategy).
*   **Data:** Google Earth Engine (Geospatial Intelligence).

---

## 6️⃣ Impact & Future Scope
*   **Immediate Impact:** Reduces policy feasibility study time from **6 months to 6 seconds**.
*   **Future Scope:**
    *   Integrate real-time IoT sensor data from city streets.
    *   Launch a "Citizen Mode" where residents can vote on proposed simulations.
    *   Scale from Single District -> Full Smart City OS.

**"We are not just mapping the problem. We are simulating the cure."**
