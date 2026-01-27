$PROJECT_ID = "urbun-carbon-twin"
$REGION = "us-central1"

Write-Host "Starting deployment to GCP Project: $PROJECT_ID" -ForegroundColor Cyan

# Define services in dependency order
$services = @(
    "gis-service",
    "emission-engine",
    "dispersion-engine",
    "intervention-engine",
    "optimizer-service"
)

# Store URLs for the final gateway deployment
$ServiceUrls = @{}

# 1. Enable APIs (idempotent)
Write-Host "Enabling required APIs..."
gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com --project $PROJECT_ID

# 2. Deploy Backend Services
foreach ($service in $services) {
    Write-Host "`n----------------------------------------"
    Write-Host "Deploying $service..." -ForegroundColor Yellow
    Write-Host "----------------------------------------"

    # Build
    Write-Host "Building image..."
    gcloud builds submit --tag gcr.io/$PROJECT_ID/$service "./services/$service" --project $PROJECT_ID

    # Set Environment Variables if service has dependencies
    $EnvVars = ""
    if ($service -eq "dispersion-engine") {
        $EnvVars = "GIS_BASE_URL=$($ServiceUrls['gis-service']),EMISSION_ENGINE_URL=$($ServiceUrls['emission-engine'])"
    }
    elseif ($service -eq "optimizer-service") {
        $EnvVars = "DISPERSION_ENGINE_URL=$($ServiceUrls['dispersion-engine']),INTERVENTION_ENGINE_URL=$($ServiceUrls['intervention-engine'])"
    }

    # Deploy
    Write-Host "Deploying to Cloud Run..."
    if ($EnvVars -ne "") {
        gcloud run deploy $service `
            --image gcr.io/$PROJECT_ID/$service `
            --platform managed `
            --region $REGION `
            --allow-unauthenticated `
            --project $PROJECT_ID `
            --set-env-vars $EnvVars
    }
    else {
        gcloud run deploy $service `
            --image gcr.io/$PROJECT_ID/$service `
            --platform managed `
            --region $REGION `
            --allow-unauthenticated `
            --project $PROJECT_ID
    }

    # Capture URL
    $Url = gcloud run services describe $service --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID
    if ($Url) {
        Write-Host "Successfully deployed $service at: $Url" -ForegroundColor Green
        $ServiceUrls[$service] = $Url
    }
    else {
        Write-Host "Error: Failed to capture URL for $service" -ForegroundColor Red
        exit 1
    }
}

# 3. Deploy API Gateway with Linked URLs
Write-Host "`n----------------------------------------"
Write-Host "Deploying api-gateway..." -ForegroundColor Yellow
Write-Host "----------------------------------------"

$GisUrl = $ServiceUrls["gis-service"]
$EmissionUrl = $ServiceUrls["emission-engine"]
$DispersionUrl = $ServiceUrls["dispersion-engine"]
$InterventionUrl = $ServiceUrls["intervention-engine"]
$OptimizerUrl = $ServiceUrls["optimizer-service"]

Write-Host "Linking services:"
Write-Host "GIS: $GisUrl"
Write-Host "Emission: $EmissionUrl"

# Build Gateway
gcloud builds submit --tag gcr.io/$PROJECT_ID/api-gateway "./services/api-gateway" --project $PROJECT_ID

# Deploy Gateway with Env Vars
gcloud run deploy api-gateway `
    --image gcr.io/$PROJECT_ID/api-gateway `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --project $PROJECT_ID `
    --set-env-vars "GIS_BASE_URL=$GisUrl,EMISSION_ENGINE_URL=$EmissionUrl,DISPERSION_ENGINE_URL=$DispersionUrl,INTERVENTION_ENGINE_URL=$InterventionUrl,OPTIMIZER_ENGINE_URL=$OptimizerUrl,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=$REGION"

# Final Output
$GatewayUrl = gcloud run services describe api-gateway --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID

Write-Host "`n========================================"
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "API Gateway: $GatewayUrl"
Write-Host "Frontend Value (NEXT_PUBLIC_API_GATEWAY): $GatewayUrl"
Write-Host "========================================"
