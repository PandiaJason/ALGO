#!/usr/bin/env bash
# ==============================================================================
# ALGO Evaluator Deployment Script (Oracle Cloud Always Free / Linux VPS)
# Sets up Docker Engine, builds the hardened algo-runner image, and launches worker
# ==============================================================================
set -euo pipefail

echo "=================================================================="
echo "🚀 ALGO PRODUCTION EVALUATOR DEPLOYMENT (FREE-TIER DOCKER HOST)"
echo "=================================================================="

# 1. Detect Architecture & Environment
ARCH=$(uname -m)
echo "Detected Host Architecture: $ARCH"

# 2. Verify or Install Docker Engine
if ! command -v docker &> /dev/null; then
    echo "📦 Docker not detected. Installing official Docker Engine..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y ca-certificates curl gnupg lsb-release
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg || true
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    else
        echo "Please install Docker manually on your Linux distribution."
        exit 1
    fi
    sudo usermod -aG docker "$USER" || true
    echo "✓ Docker installed successfully."
fi

# 3. Verify Docker Daemon is Running
if ! docker info &> /dev/null; then
    echo "Starting Docker service..."
    sudo systemctl enable docker || true
    sudo systemctl start docker || true
fi
echo "✓ Docker Daemon is active."

# 4. Build the Hardened Sandbox Runner Image
echo "🔨 Building hardened execution sandbox (algo-runner:latest)..."
docker build -t algo-runner:latest -f sandbox/Dockerfile .
echo "✓ algo-runner:latest image built successfully."

# 5. Check Environment Configuration
if [ ! -f "evaluator/.env" ] && [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
    echo "⚠️ No .env file found for evaluator. Creating evaluator/.env from template..."
    cat << 'EOF' > evaluator/.env
# Production PostgreSQL connection string (Neon / Supabase / Self-hosted)
DATABASE_URL=postgresql://user:password@host/db

# Production Redis connection string for BullMQ queue (Upstash / Self-hosted)
REDIS_URL=redis://host:6379

# Concurrency & limits
WORKER_CONCURRENCY=2
HEALTH_PORT=8080
SANDBOX_TIMEOUT_SECONDS=25
SANDBOX_MEMORY_LIMIT_MB=256
SANDBOX_CPU_LIMIT=1.0
EOF
    echo "Created evaluator/.env. Please edit evaluator/.env with your DATABASE_URL and REDIS_URL before running."
    exit 0
fi

# Copy active env if available
if [ -f ".env.local" ] && [ ! -f "evaluator/.env" ]; then
    cp .env.local evaluator/.env
fi

# 6. Launch Evaluator via Docker Compose
echo "⚡ Starting ALGO Evaluator Worker daemon..."
docker compose -f evaluator/docker-compose.yml --env-file evaluator/.env up -d --build

# 7. Wait & Verify Health Check
echo "⏳ Waiting for evaluator health check on port 8080..."
sleep 5
for i in {1..10}; do
    if curl -s http://localhost:8080/health | grep -q "healthy"; then
        echo "✅ ALGO Evaluator Worker is HEALTHY and listening for submissions!"
        curl -s http://localhost:8080/health | jq . 2>/dev/null || curl -s http://localhost:8080/health
        exit 0
    fi
    echo "Checking health... ($i/10)"
    sleep 3
done

echo "⚠️ Health check took longer than expected. Check logs via: docker compose -f evaluator/docker-compose.yml logs -f"
