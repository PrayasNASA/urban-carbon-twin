# 🚀 Backend Deployment Status Report

*Last Updated: 2026-01-25 00:03 (Local Time)*

## 🛰️ Cloud Run Services Status (us-central1)

| Service | Last Deployment (UTC) | Status | Latest Revision |
| :--- | :--- | :--- | :--- |
| **`emission-engine`** | **2026-01-24 17:05:39** | ✅ Ready | `emission-engine-00007-jws` |
| **`api-gateway`** | 2026-01-23 07:15:56 | ✅ Ready | `api-gateway-00007-p6r` |
| **`optimizer-service`** | 2026-01-23 07:15:56 | ✅ Ready | `optimizer-service-00006-xvb` |
| **`intervention-engine`**| 2026-01-23 07:15:38 | ✅ Ready | `intervention-engine-00006-cqn` |
| **`dispersion-engine`** | 2026-01-23 07:15:20 | ✅ Ready | `dispersion-engine-00006-qgl` |
| **`gis-service`** | 2026-01-23 07:12:55 | ✅ Ready | `gis-service-00007-8vz` |

---

## 🔗 API Gateway Environment Variables

Confirmed that the `api-gateway` correctly points to the current Cloud Run URLs for all sub-services.

---

## 🛠️ Verification Commands

```powershell
# List services and status
gcloud run services list --platform managed --region us-central1

# Check latest logs for a service
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=emission-engine" --limit 10
```
