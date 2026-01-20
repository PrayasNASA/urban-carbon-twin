FROM ghcr.io/osgeo/gdal:ubuntu-small-3.9.0

WORKDIR /app

# Install Python + venv support
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

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
CMD ["python", "-m", "app.main"]
