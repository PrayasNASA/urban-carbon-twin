FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Cloud Run uses PORT=8080
ENV PORT=8080

# IMPORTANT: correct module path and port.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]


# HI 