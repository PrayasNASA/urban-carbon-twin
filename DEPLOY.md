# 🚀 Deployment Guide

This guide explains how to deploy the **Urban Carbon Twin** platform to production environments.

## ☁️ Backend: Google Cloud Platform (Cloud Run)

The backend consists of 6 microservices. We recommend **Google Cloud Run** for its scalability and ease of use.

### Prerequisites
1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
2. Create a GCP Project and enable billing ..

### Steps
1. **Configure with your project**:
   ```powershell
   # Edit scripts/deploy-gcp.ps1 and replace YOUR_PROJECT_ID
   ```

2. **Run the deployment script**:
   ```powershell
   ./scripts/deploy-gcp.ps1
   ```

3. **Orchestrate URLs**:
   After deployment, each service will have an `https://...a.run.app` URL. 
   - Update the **API Gateway** environment variables in the GCP Console to point to the other services' URLs (e.g., `GIS_BASE_URL`).

---

## 🎨 Frontend: Vercel

The frontend is a Next.js application designed to connect to your deployed backend.

### Steps
1. **Push to GitHub**: Push the repository to a private or public GitHub repo.
2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com) -> New Project.
   - Select the `urban-carbon-twin` repository.
   - Set the **Root Directory** to `frontend/next-dashboard`.
3. **Environment Variables**:
   Add the following variable in the Vercel Dashboard:
   - `NEXT_PUBLIC_API_GATEWAY`: Your deployed **API Gateway** Cloud Run URL.
4. **Deploy**: Click Deploy.

---

## 🔗 Environment Variable Mapping

| Service | Variable | Value |
| :--- | :--- | :--- |
| **Frontend** | `NEXT_PUBLIC_API_GATEWAY` | https://api-gateway-xxxx.a.run.app |
| **API Gateway** | `GIS_BASE_URL` | https://gis-service-xxxx.a.run.app |
| **API Gateway** | `EMISSION_ENGINE_URL` | https://emission-engine-xxxx.a.run.app |
| **API Gateway** | `DISPERSION_ENGINE_URL` | https://dispersion-engine-xxxx.a.run.app |
| **API Gateway** | `INTERVENTION_ENGINE_URL` | https://intervention-engine-xxxx.a.run.app |
| **API Gateway** | `OPTIMIZER_ENGINE_URL` | https://optimizer-service-xxxx.a.run.app |
