import urllib.request
import json
import time
import subprocess

print("Pinging the monolith API...")

req = urllib.request.Request(
    "https://api-gateway-yn5z.onrender.com/scenario/simulation/initialize",
    data=json.dumps({"lat": 40.7128, "lon": -74.006, "budget": 80000}).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print("Success! Response:", json.dumps(data, indent=2))
except Exception as e:
    print("FAILED:", e)
    if hasattr(e, 'read'):
        print(e.read().decode())
