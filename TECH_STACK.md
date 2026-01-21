# 🛠️ Technology Stack - Urban Carbon Twin

A deep dive into the high-performance technologies powering the Urban Carbon Twin digital twin platform.

---

## 🎨 Frontend: Premium Dashboard
The frontend is built with a focus on high-fidelity visualization and responsive design.

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Beta)
- **Icons & UI**: [Lucide React](https://lucide.dev/)
- **Visuals**: 3D Topology Grids & Resource Logic Overlays
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🧠 Backend: Microservices Architecture
The simulation core is composed of several decoupled Python services orchestrated via a central Gateway.

- **Language**: Python 3.12
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (High-performance ASGI framework)
- **Data Validation**: [Pydantic v2](https://docs.pydantic.dev/)
- **API Documentation**: OpenAPI (Swagger) integration

### 🧪 Core Engines
1.  **API Gateway**: Orchestrates requests between frontend and microservices.
2.  **GIS Service**: Handles street layouts and building footprint processing.
3.  **Emission Engine**: Models traffic and point-source CO₂ emissions.
4.  **Dispersion Engine**: Simulates micro-climatic CO₂ flow using physics-based models.
5.  **Intervention Engine**: Manages the catalog of sequestration strategies.
6.  **Optimization Engine**: Computational logic for cost-aware budget allocation.

---

## 📈 Scientific & Data Libraries
- **NumPy**: For high-speed numerical computations.
- **Requests / HTTPX**: For inter-service communication.
- **GeoJSON**: For spatial data representation.

---

## 🏗️ Infrastructure & DevOps
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **Cloud Hosting**: [Google Cloud Run](https://cloud.google.com/run) (Serverless Microservices)
- **Version Control**: GitHub with structured branching (feature-based workflow)

---

## 📐 System Flow
```mermaid
flowchart LR
    A[Dashboard] <-> B(API Gateway)
    B <-> C[GIS Engine]
    B <-> D[Simulation Core]
    B <-> E[Optimization Core]
```

---

## 📜 Development Standards
- **Architecture**: RESTful Microservices
- **Communication**: JSON-based asynchronous-ready protocols
- **Standards**: Pydantic-enforced schema validation for all interfaces
