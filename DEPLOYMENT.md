# ALGO Production Deployment Runbook

This guide covers deploying the full ALGO platform for real.

---

## Architecture Overview

ALGO has 5 production components:
1. **Next.js Web Application**: Frontend, APIs, Monaco Editor, Authentication.
2. **PostgreSQL 16**: Relational storage for users, challenges, submissions, leaderboards.
3. **Redis 7**: High-throughput message broker for the BullMQ job evaluation queue.
4. **ALGO Execution Worker**: Node.js/TypeScript daemon processing submitted code.
5. **Docker Host Sandbox**: Spawns isolated `algo-runner:latest` containers (`--network none`, 256MB RAM limit) to compile and benchmark student solutions.

---

## Deployment Strategy 1: Vercel + Cloud Database (Frontend Only / Hybrid)

If you connect the GitHub repository `https://github.com/PandiaJason/ALGO.git` to **Vercel**:

### 1. Vercel Project Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 2. Environment Variables on Vercel
Add the following in **Vercel Settings -> Environment Variables**:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Cloud PostgreSQL URL (from Neon / Supabase / Railway) |
| `REDIS_URL` | Cloud Redis URL (from Upstash / Railway Redis) |
| `AUTH_SECRET` | 32+ character random secret (`openssl rand -base64 32`) |
| `AUTH_URL` | Your production URL (e.g., `https://algo.vercel.app`) |
| `AUTH_GOOGLE_ID` | Google Cloud OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google Cloud OAuth Client Secret |

> [!WARNING]
> **Worker & Docker Sandbox Requirement**:
> Vercel serverless functions cannot execute long-lived Docker sandboxes (`docker run algo-runner:latest`).
> If deploying the web app on Vercel, the **Worker** (`worker/src/index.ts`) must run on a separate Linux server or Railway VM with access to a Docker daemon.

---

## Deployment Strategy 2: Complete Single-Server Production (Recommended)

Run the entire system (Web + Worker + Postgres + Redis + Docker Sandbox + Automatic SSL) on a single **$6–$12/month Linux Cloud VPS** (DigitalOcean Droplet, Hetzner Cloud, AWS EC2, Linode, or Railway).

### Step 1: Provision Cloud VPS
1. Create an **Ubuntu 24.04** VPS.
2. SSH into your server:
   ```bash
   ssh root@<YOUR_SERVER_IP>
   ```

### Step 2: Install Docker & Docker Compose
```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker ubuntu || true
```

### Step 3: Clone Repository
```bash
git clone https://github.com/PandiaJason/ALGO.git /opt/algo
cd /opt/algo
```

### Step 4: Build the Sandbox Container
```bash
docker build -t algo-runner:latest ./sandbox
```

### Step 5: Configure Environment Secrets
Create `/opt/algo/.env.production`:
```bash
POSTGRES_DB=algo
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<GENERATE_SECURE_PASSWORD>

AUTH_SECRET=<GENERATE_WITH_openssl rand -base64 32>
AUTH_URL=https://<YOUR_DOMAIN_OR_IP>

AUTH_GOOGLE_ID=<YOUR_GOOGLE_CLIENT_ID>
AUTH_GOOGLE_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
```

### Step 6: Configure Domain & Automatic SSL
Edit `Caddyfile`:
```caddy
algo.yourdomain.com {
    reverse_proxy web:3000
}
```

### Step 7: Launch the Full Production Stack
```bash
docker compose -f docker-compose.prod.yml up -d
```

### Step 8: Run Database Migrations & Initial Setup
```bash
docker compose -f docker-compose.prod.yml exec web npx drizzle-kit migrate
docker compose -f docker-compose.prod.yml exec web npx tsx src/db/seed.ts
```

---

## Deployment Strategy 3: Instant Live Public URL (Cloudflare Tunnel)

To make your currently running ALGO instance instantly accessible to anyone in the world right now with a secure public HTTPS URL:

```bash
# Install Cloudflare tunnel
brew install cloudflared

# Launch instant temporary public tunnel
cloudflared tunnel --url http://localhost:3000
```
This will output a live HTTPS URL (e.g. `https://random-name.trycloudflare.com`) routing to your running Next.js platform!

---

## Admin Control Plane Access
- Only **Jason Pandian** (`pandiajason@gmail.com`) is authorized to access the `/admin` dashboard.
- Any unauthorized account attempting to access `/admin` will be redirected to `/admin/login` with an `AccessDenied` error notice.
