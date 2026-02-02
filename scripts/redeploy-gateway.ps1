$ErrorActionPreference = "Stop"
$PROJECT_ID = "urbun-carbon-twin"
$REGION = "us-central1"

Write-Host "Fetching Backend Service URLs..." -ForegroundColor Cyan
$GisUrl = gcloud run services describe gis-service --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID
$EmissionUrl = gcloud run services describe emission-engine --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID
$DispersionUrl = gcloud run services describe dispersion-engine --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID
$InterventionUrl = gcloud run services describe intervention-engine --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID
$OptimizerUrl = gcloud run services describe optimizer-service --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID

Write-Host "Redeploying API Gateway..." -ForegroundColor Yellow
gcloud builds submit --tag gcr.io/$PROJECT_ID/api-gateway "./services/api-gateway" --project $PROJECT_ID

gcloud run deploy api-gateway `
    --image gcr.io/$PROJECT_ID/api-gateway `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --project $PROJECT_ID `
    --set-env-vars "GIS_BASE_URL=$GisUrl,EMISSION_ENGINE_URL=$EmissionUrl,DISPERSION_ENGINE_URL=$DispersionUrl,INTERVENTION_ENGINE_URL=$InterventionUrl,OPTIMIZER_ENGINE_URL=$OptimizerUrl,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=$REGION,GOOGLE_APPLICATION_CREDENTIALS=/app/urbun-carbon-twin.json"

Write-Host "API Gateway Redeployed!" -ForegroundColor Green
