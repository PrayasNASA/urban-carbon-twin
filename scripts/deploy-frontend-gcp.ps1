$ErrorActionPreference = "Stop"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition
$PROJECT_ROOT = Split-Path -Parent $SCRIPT_DIR
Set-Location $PROJECT_ROOT

$PROJECT_ID = "urbun-carbon-twin"
$REGION = "us-central1"
$SERVICE_NAME = "next-dashboard"

Write-Host "Starting Frontend Deployment..." -ForegroundColor Cyan
Write-Host "Project: $PROJECT_ID"
Write-Host "Region: $REGION"

# 1. Get API Gateway URL
Write-Host "Fetching API Gateway URL..."
$GatewayUrl = gcloud run services describe api-gateway --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID

if (-not $GatewayUrl) {
    Write-Host "Error: API Gateway URL not found. Is api-gateway deployed?" -ForegroundColor Red
    exit 1
}
Write-Host "Found API Gateway: $GatewayUrl" -ForegroundColor Green

# 2. Build Image with Cloud Build
Write-Host "Building image with Cloud Build..." -ForegroundColor Yellow
$ImageName = "gcr.io/$PROJECT_ID/$SERVICE_NAME"
gcloud builds submit --config ./frontend/next-dashboard/cloudbuild.yaml `
    --substitutions="_NEXT_PUBLIC_API_GATEWAY=$GatewayUrl" `
    ./frontend/next-dashboard `
    --project $PROJECT_ID

# 3. Deploy Image to Cloud Run
Write-Host "Deploying $SERVICE_NAME to Cloud Run..." -ForegroundColor Yellow

gcloud run deploy $SERVICE_NAME `
    --image $ImageName `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --project $PROJECT_ID

$FrontendUrl = gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID

Write-Host "`n========================================"
Write-Host "Frontend Deployment Complete!" -ForegroundColor Green
Write-Host "Frontend URL: $FrontendUrl"
Write-Host "========================================"
