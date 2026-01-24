# Urban Carbon Twin - Project Handbook

## 1. Project Purpose
**Urban Carbon Twin** is a High-Fidelity Digital Twin platform designed to simulate, visualize, and optimize urban carbon sequestration strategies.

**Goal**: To empower city planners and environmental scientists with a "Solarpunk Intelligence Engine" that analyzes valid geospatial data and recommends specific nature-based and technological interventions (like Algae Bio-Panels or Direct Air Capture) to neutralize carbon emissions.

It solves the problem of "blind investment" by showing exactly *where* and *how* to allocate capital to maximize air quality improvement.

---

## 2. Architecture Overview
The system follows a modern Microservices Event-Driven Architecture:

### **Frontend (The Dashboard)**
- **Tech**: Next.js (React), TypeScript, Tailwind CSS, Framer Motion.
- **Role**: Provides the "Glassmorphic" UI/UX, 3D Grid Visualization (`CityGrid.tsx`), and Real-time Optimization Control (`ScenarioPanel.tsx`).
- **Key Component**: The `ScenarioPanel` allows users to convert financial capital (Slider) into environmental action.

### **Backend (The Intelligence)**
- **Tech**: Python (FastAPI), Google Cloud Platform (Cloud Run).
- **Services**:
    - **API Gateway**: Orchestrates requests.
    - **Emission Engine**: Runs the core physics and financial simulations.
    - **GIS Service**: Handles geospatial data mapping.
    - **Intervention Engine**: Calculates the efficiency of different tech (Trees vs. Machines).

---

## 3. Scientific & Simulation Logic

### **How Grids Work & Area Coverage**
- **Grid System**: The city is divided into a **20x20 High-Fidelity Grid** (400 unique nodes).
- **Area**: Each grid node represents a geospatial block of approximately **100m x 100m** (1 hectare), covering a total simulated area of 4 sq km in the immediate view.
- **Conversion**: Lat/Long coordinates are converted into Cartesian grid points. We calculate `distance_from_center` to simulate urban heat islands (higher CO2 in the city center).

### **Air Quality Criteria (AQI / CO2 PPM)**
The system categorizes air quality based on `concentration` (PPM - Parts Per Million of scaled CO2 eq):
- **🟢 SAFE (Green)**: `< 40 PPM`. Healthy urban air.
- **🟠 CAUTION (Orange)**: `40 - 75 PPM`. Moderate pollution, requiring soft interventions (Trees).
- **🔴 HAZARDOUS (Red)**: `> 75 PPM`. Critical toxicity, requiring hard interventions (Direct Air Capture).

### **Calculations**
#### **1. Estimated Sequestration (TN_CO2_EQ)**
This measures purely *how much carbon is removed* by an intervention.
**Formula**:
$$Reduction = BaselineCO2 \times TechnologyEfficiency \times (1 + (Units \times 0.1))$$
- *Example*: Deploying 5 units of Direct Air Capture (25% efficiency) removes a massive chunk of pollution from a single node.

#### **2. Efficiency Index**
This tracks **Capital Allocation Performance**. It is calculated as the percentage of the allocated Global Budget that was successfully converted into viable infrastructure.
- **100%** = Perfect allocation (Every dollar spent).
- **< 100%** = Surplus capital (Not enough polluted grids to justify the spend).

#### **3. Capital Allocation Logic**
When you increase the budget (Slider):
1. The **Solarpunk Engine** scans all 400 grids.
2. It prioritizes the **Red Zones** (Highest Concentration).
3. It selects the most expensive/effective tech the budget can afford (e.g., DAC > Algae > Trees).
4. **Correction Fix**: Previously, the simulation showed the *baseline*. Now, it subtracts the `Estimated Sequestration` from the grid's value, turning **Red Grids -> Green**.

---

## 4. Terminology Decoder (For Judges)

| Term | Definition |
| :--- | :--- |
| **Solarpunk Intelligence Engine** | The core deterministic algorithm that allocates resources based on a "Nature + Tech" harmony philosophy. |
| **Biophilic Simulation** | The module that generates the organic, wave-like pollution patterns (using sine/cosine dispersion) rather than random noise. |
| **ELMT_G-230** | **Element Grid Node #230**. A specific geographical coordinate in the 20x20 grid system. |
| **SOLVER_V4.2** | The version of the optimization logic that balances Cost vs. Impact. |
| **v4.0_NATURE_TECH** | The standard catalog of interventions (Trees, Algae, Carbon Capture) used in this simulation cycle. |
| **Intensity (6 Units)** | The density of deployment. "6 Units" means 6 individual modules (e.g., 6 AI Trees) planted in that single grid square. |
| **Direct Air Capture** | High-cost, High-efficiency industrial removal of CO2. |
| **Algae Bio-Panel** | Mid-range biotech intervention. Uses photosynthesis to scrub air. |

---

## 5.For locally test the issues
Here are the commands to run the Emission Engine, API Gateway, and Frontend locally so you can verify the fix without deploying.

You will need 3 separate terminals.

Terminal 1: Emission Engine (Backend)
This runs the service where we fixed the logic.

cd services/emission-engine
uvicorn main:app --reload --port 8002

erminal 2: API Gateway
This connects the frontend to the backend. We need to tell it where to find your local emission engine.

cd services/api-gateway
$env:EMISSION_ENGINE_URL="http://127.0.0.1:8002"
uvicorn main:app --reload --port 8000

Terminal 3: Frontend (Dashboard)
This runs the UI, pointing to your local API Gateway.

Terminal 3: Frontend (Dashboard)
This runs the UI, pointing to your local API Gateway.

cd frontend/next-dashboard
$env:NEXT_PUBLIC_API_GATEWAY="http://127.0.0.1:8000"
npm run dev

Testing: Open http://localhost:3000, increase the capital allocation slider to $500k, and hit Initialize Simulation. You should see the grids turn Green! 🟢