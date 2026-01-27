$PROJECT_ID = "urbun-carbon-twin"
$REGION = "us-central1"

Write-Host "=== Configuring GCP Microservices Stack ===" -ForegroundColor Cyan

# 1. Retrieve all service URLs
Write-Host "Capturing live URLs..."
$Urls = @{}
$services = @("gis-service", "emission-engine", "dispersion-engine", "intervention-engine", "optimizer-service", "api-gateway")

foreach ($s in $services) {
    $url = gcloud run services describe $s --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID
    if ($url) {
        $Urls[$s] = $url.TrimEnd("/")
        Write-Host "Found $s at: $($Urls[$s])" -ForegroundColor Green
    }
    else {
        Write-Host "Warning: Could not find URL for $s" -ForegroundColor Yellow
    }
}

# 2. Update GIS Service (No dependencies usually, but good to ensure defaults)
Write-Host "`nConfiguring gis-service..."
# GIS usually independent

# 3. Update Emission Engine (Depends on GIS)
Write-Host "Configuring emission-engine..."
if ($Urls["gis-service"]) {
    gcloud run services update emission-engine --platform managed --region $REGION --project $PROJECT_ID `
        --update-env-vars "GIS_BASE_URL=$($Urls['gis-service'])"
}

# 4. Update Dispersion Engine (Depends on GIS, Emission)
Write-Host "Configuring dispersion-engine..."
if ($Urls["gis-service"] -and $Urls["emission-engine"]) {
    gcloud run services update dispersion-engine --platform managed --region $REGION --project $PROJECT_ID `
        --update-env-vars "GIS_BASE_URL=$($Urls['gis-service']),EMISSION_ENGINE_URL=$($Urls['emission-engine'])"
}

# 5. Update Intervention Engine (Depends on Dispersion)
Write-Host "Configuring intervention-engine..."
if ($Urls["dispersion-engine"]) {
    gcloud run services update intervention-engine --platform managed --region $REGION --project $PROJECT_ID `
        --update-env-vars "DISPERSION_ENGINE_URL=$($Urls['dispersion-engine'])"
}

# 6. Update Optimizer Service (Depends on Dispersion, Intervention)
Write-Host "Configuring optimizer-service..."
if ($Urls["dispersion-engine"] -and $Urls["intervention-engine"]) {
    gcloud run services update optimizer-service --platform managed --region $REGION --project $PROJECT_ID `
        --update-env-vars "DISPERSION_ENGINE_URL=$($Urls['dispersion-engine']),INTERVENTION_ENGINE_URL=$($Urls['intervention-engine'])"
}

# 7. Update API Gateway (Depends on ALL)
Write-Host "Configuring api-gateway..."
$gatewayVars = "GIS_BASE_URL=$($Urls['gis-service'])," +
"EMISSION_ENGINE_URL=$($Urls['emission-engine'])," +
"DISPERSION_ENGINE_URL=$($Urls['dispersion-engine'])," +
"INTERVENTION_ENGINE_URL=$($Urls['intervention-engine'])," +
"OPTIMIZER_ENGINE_URL=$($Urls['optimizer-service'])," +
"GOOGLE_CLOUD_PROJECT=$PROJECT_ID," +
"GOOGLE_CLOUD_LOCATION=$REGION"

gcloud run services update api-gateway --platform managed --region $REGION --project $PROJECT_ID `
    --update-env-vars $gatewayVars

Write-Host "`nAll services configured!" -ForegroundColor Cyan
Write-Host "Wait 30-60 seconds for Cloud Run to rotate revisions."
