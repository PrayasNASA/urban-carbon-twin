FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Build args
ARG NEXT_PUBLIC_API_GATEWAY
ENV NEXT_PUBLIC_API_GATEWAY=$NEXT_PUBLIC_API_GATEWAY

# Build Next.js app
RUN npm run build

# Expose Next.js port
EXPOSE 3000

# Start Next.js
CMD ["npm", "run", "start"]
