FROM ghcr.io/osgeo/gdal:alpine-small-3.9.0

WORKDIR /app

# Install Python + venv support
RUN apk add --no-cache python3 py3-pip py3-virtualenv

# Create virtual environment
RUN python3 -m venv /venv

# Activate venv
ENV PATH="/venv/bin:$PATH"

# Install dependencies inside venv
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Cloud Run port
ENV PORT=8080

# Start FastAPI
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
