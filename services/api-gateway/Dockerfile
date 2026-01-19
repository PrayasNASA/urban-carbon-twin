# FROM python:3.11-slim

# WORKDIR /app

# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# ENV PORT 8000
# CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]


                              
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# IMPORTANT: do NOT set PORT manually
CMD exec uvicorn main:app --host 0.0.0.0 --port $PORT