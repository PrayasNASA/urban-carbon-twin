$PROJECT_ID = "urbun-carbon-twin"
$REGION = "us-central1"

Write-Host "Starting API Gateway Fix for project: $PROJECT_ID" -ForegroundColor Cyan

# 1. Retrieve Service URLs
Write-Host "Retrieving service URLs..."
$GisUrl = gcloud run services describe gis-service --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID
$EmissionUrl = gcloud run services describe emission-engine --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID
$DispersionUrl = gcloud run services describe dispersion-engine --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID
$InterventionUrl = gcloud run services describe intervention-engine --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID
$OptimizerUrl = gcloud run services describe optimizer-service --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID

if (-not $GisUrl) {
    Write-Host "Error: Could not retrieve GIS Service URL. Is it deployed?" -ForegroundColor Red
    exit 1
}

Write-Host "GIS: $GisUrl" -ForegroundColor Green
Write-Host "Emission: $EmissionUrl" -ForegroundColor Green
Write-Host "Dispersion: $DispersionUrl" -ForegroundColor Green
Write-Host "Intervention: $InterventionUrl" -ForegroundColor Green
Write-Host "Optimizer: $OptimizerUrl" -ForegroundColor Green

# 2. Update API Gateway
Write-Host "`nUpdating API Gateway configuration..." -ForegroundColor Yellow

# Using simpler syntax that avoids PowerShell escaping issues
$EnvVars = "GIS_BASE_URL=$GisUrl," +
"EMISSION_ENGINE_URL=$EmissionUrl," +
"DISPERSION_ENGINE_URL=$DispersionUrl," +
"INTERVENTION_ENGINE_URL=$InterventionUrl," +
"OPTIMIZER_ENGINE_URL=$OptimizerUrl," +
"GOOGLE_CLOUD_PROJECT=$PROJECT_ID," +
"GOOGLE_CLOUD_LOCATION=$REGION"

gcloud run services update api-gateway `
    --platform managed `
    --region $REGION `
    --project $PROJECT_ID `
    --set-env-vars $EnvVars

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSUCCESS! API Gateway updated." -ForegroundColor Green
    Write-Host "Please wait a moment for the new revision to be ready."
}
else {
    Write-Host "`nError updating API Gateway." -ForegroundColor Red
}
