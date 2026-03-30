# Deploying Urban Carbon Twin to Render and Vercel

This guide maps exactly how you can deploy your application after Google Cloud free credits expire. The backend services migrate to **Render**, and the Next.js frontend migrates to **Vercel**.

## 1. Deploy the Backend to Render

Given there are 6 interconnected microservices, we have created a **Render Blueprint** (`render.yaml`). This automatically detects the Dockerfiles, links the environment variables properly through internal URLs, and provisions the correct Free instances on Render.

1. Create a free account at [https://dashboard.render.com](https://dashboard.render.com).
2. Connect your GitHub account.
3. Commit and push the `render.yaml` file to your GitHub repository.
4. On the Render Dashboard, click **New +** and select **Blueprint**.
5. Select your `urban-carbon-twin` repository.
6. Render will automatically detect the `render.yaml` file and parse 6 web services.
7. Click **Apply**: Render will deploy the API Gateway and the 5 engines simultaneously!

> **Note about the Free Tier:**
> Render grants you 750 free instance hours per month across all un-paid services. Because your architecture consists of 6 microservices, those 750 hours are shared. If running 24/7 constantly, the backend will exhaust your allowance in 5-6 days. Luckily, Render free instances automatically "spin down" and go to sleep after 15 minutes of inactivity to save hours. Be patient during a "cold start" (when visiting the dashboard after a long period of inactivity, the API Gateway might take 50 seconds to boot up).

### Verifying Render Deployment

Once everything finishes building in your Render Dashboard, click on your **api-gateway** service.
- Copy the public Render URL assigned to it (e.g., `https://api-gateway-xyz.onrender.com`).
- We will need this URL for the frontend.

---

## 2. Deploy the Frontend to Vercel

Vercel is natively tailored for Next.js applications and has a dedicated Free tier that does not consume hours.

1. Go to [https://vercel.com/](https://vercel.com/) and create a free account linked to your GitHub.
2. Click **Add New** > **Project** and import the `urban-carbon-twin` repository.
3. Before hitting Deploy, click on the **Root Directory** field and select `./frontend/next-dashboard` (because the frontend code is not in the project root).
4. Vercel will auto-detect Next.js.
5. In the **Environment Variables** section, add the following key:
   - **Key**: `NEXT_PUBLIC_API_GATEWAY`
   - **Value**: `<URL_OF_YOUR_RENDER_API_GATEWAY>` (e.g., `https://api-gateway-xyz.onrender.com`)
6. Click **Deploy**.

Vercel will quickly spin up your Next.js application, bundle it efficiently, and give you a fast, globally distributed URL (like `https://urban-carbon-twin-1234.vercel.app`). Opening the page will successfully connect back to your Render API Gateway!
