$PROJECT_ID = "urbun-carbon-twin"
$REGION = "us-central1"

Write-Host "Starting deployment to GCP Project: $PROJECT_ID" -ForegroundColor Cyan

$services = @(
    "gis-service",
    "emission-engine",
    "dispersion-engine",
    "intervention-engine",
    "optimizer-service",
    "api-gateway"
)

# 1. Enable APIs
Write-Host "Enabling required APIs..."
gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com --project $PROJECT_ID

# 2. Build and Push images
foreach ($service in $services) {
    Write-Host "Building and pushing $service..." -ForegroundColor Yellow
    gcloud builds submit --tag gcr.io/$PROJECT_ID/$service "./services/$service" --project $PROJECT_ID
}

# 3. Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..." -ForegroundColor Green

foreach ($service in $services) {
    Write-Host "Deploying $service..." -ForegroundColor Yellow
    
    if ($service -eq "api-gateway") {
        # Using expanded arguments for robustness
        gcloud run deploy $service `
            --image gcr.io/$PROJECT_ID/$service `
            --platform managed `
            --region $REGION `
            --allow-unauthenticated `
            --project $PROJECT_ID `
            --set-env-vars "GIS_BASE_URL=https://gis-service-owkex2u2ca-uc.a.run.app,EMISSION_ENGINE_URL=https://emission-engine-owkex2u2ca-uc.a.run.app,DISPERSION_ENGINE_URL=https://dispersion-engine-owkex2u2ca-uc.a.run.app,INTERVENTION_ENGINE_URL=https://intervention-engine-owkex2u2ca-uc.a.run.app,OPTIMIZER_ENGINE_URL=https://optimizer-service-owkex2u2ca-uc.a.run.app"
    }
    else {
        gcloud run deploy $service `
            --image gcr.io/$PROJECT_ID/$service `
            --platform managed `
            --region $REGION `
            --allow-unauthenticated `
            --project $PROJECT_ID
    }
}

Write-Host "All services deployed!" -ForegroundColor Green
Write-Host "Please grab the URLs if you need to manually verify them in the Google Cloud Console."
