import urllib.request
import urllib.error
import urllib.parse
import json

base_url = "https://api-gateway-yn5z.onrender.com"

endpoints = [
    {"path": "/", "method": "GET"},
    {"path": "/scenario/economy/market-pulse", "method": "GET"},
    {"path": "/scenario/policies/analyze?lat=40.7128&lon=-74.0060", "method": "GET"},
    {"path": "/scenario/simulation/initialize", "method": "POST", "body": {"lat": 40.7128, "lon": -74.0060, "budget": 1000000, "initial_aqi": 50}},
    {"path": "/docs", "method": "GET"}
]

print(f"Testing API Gateway on {base_url}")
for ep in endpoints:
    url = f"{base_url}{ep['path']}"
    method = ep['method']
    print(f"--- Testing [{method}] {url} ---")
    try:
        req = urllib.request.Request(url, method=method)
        if method == "POST":
            data = json.dumps(ep['body']).encode('utf-8')
            req.add_header('Content-Type', 'application/json')
            req.data = data

        with urllib.request.urlopen(req, timeout=40) as response:
            body = response.read().decode('utf-8')
            print(f"Status: {response.status}, Body (first 100 chars): {body[:100]}")
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8') if e.fp else ""
        print(f"Failed with Status: {e.code}, Body: {body[:100]}")
    except Exception as e:
        print(f"Failed: {e}")


