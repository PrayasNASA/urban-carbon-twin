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
    gcloud run deploy $service `
        --image gcr.io/$PROJECT_ID/$service `
        --platform managed `
        --region $REGION `
        --allow-unauthenticated `
        --project $PROJECT_ID
}

Write-Host "All services deployed!" -ForegroundColor Green
Write-Host "Please grab the URLs from the output above and update the environment variables in the api-gateway Cloud Run configuration."
