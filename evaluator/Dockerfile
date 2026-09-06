# Evaluator Worker Container (Node.js 22 + Docker CLI)
FROM node:22-bullseye-slim

# Install prerequisite tools and official Docker CLI so worker can invoke host Docker daemon
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    lsb-release \
    ca-certificates \
    procps \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends docker-ce-cli \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application source code
COPY src ./src
COPY worker ./worker
COPY tsconfig.json ./

ENV NODE_ENV=production
ENV WORKER_CONCURRENCY=2
ENV HEALTH_PORT=8080

EXPOSE 8080

# Run worker daemon with tsx
CMD ["npx", "tsx", "worker/src/index.ts"]
