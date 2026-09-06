# Oracle Cloud Infrastructure (OCI) Always Free Evaluator Setup

This guide provides the exact steps to provision an **Always Free ($0.00/month forever)** Linux instance on Oracle Cloud to host the ALGO Docker Evaluator.

---

### Specifications (Always Free Allowance as of Aug/Sep 2026)
- **Compute**: **Ampere A1 Arm** (Up to 2 OCPUs, 12 GB RAM) or **AMD Micro** (`VM.Standard.E2.1.Micro`, 1 vCPU, 1 GB RAM).
- **Storage**: Up to 200 GB Block Storage (Free forever).
- **Network**: Free Public IPv4 address + 10 TB/month outbound bandwidth.
- **Cost**: **$0.00 / month forever**.

---

### Step 1: Provision the Always Free VM

1. Log in to [Oracle Cloud Console](https://cloud.oracle.com/).
2. Navigate to **Compute** $\to$ **Instances** $\to$ Click **Create Instance**.
3. **Name**: `algo-evaluator-vm`.
4. **Placement**: Select any Availability Domain that shows *Always Free Eligible*.
5. **Image and Shape**:
   - **Image**: Select **Ubuntu 24.04** or **Debian 12** (*Always Free Eligible*).
   - **Shape**: 
     - Click **Change Shape** $\to$ Select **Ampere (Arm-based Processor)** $\to$ `VM.Standard.A1.Flex`.
     - Allocate: **2 OCPUs** and **12 GB Memory** (*Always Free Eligible*).
     - *(Fallback if Arm is out of host capacity in your region)*: Select **Specialty and Legacy** $\to$ `VM.Standard.E2.1.Micro` (1 vCPU, 1 GB RAM).
6. **Networking**:
   - Primary VCN: Create new or use default VCN.
   - Public IP: Check **Assign a public IPv4 address**.
7. **SSH Keys**:
   - Select **Generate a key pair for me** $\to$ Click **Save Private Key** (download `ssh-key.key`).
8. Click **Create** at the bottom. The instance will enter `RUNNING` status in ~60 seconds.

---

### Step 2: Open Ingress Ports (Security List)

1. Under **Instance Details**, click on the **Virtual Cloud Network (VCN)**.
2. Click on **Security Lists** $\to$ Select **Default Security List for...**.
3. Click **Add Ingress Rules**:
   - **Source CIDR**: `0.0.0.0/0`
   - **IP Protocol**: `TCP`
   - **Destination Port Range**: `8080` (Health check monitor)
4. Click **Add Ingress Rules**.

---

### Step 3: Connect & Deploy in 1 Command

On your local terminal, connect to your Oracle VM using the downloaded private key:

```bash
chmod 400 ssh-key.key
ssh -i ssh-key.key ubuntu@<YOUR_VM_PUBLIC_IP>
```

Once logged into your VM, run:

```bash
# 1. Clone your ALGO repository
git clone https://github.com/PandiaJason/ALGO.git
cd ALGO

# 2. Configure production database & redis in evaluator/.env
cat << 'EOF' > evaluator/.env
DATABASE_URL=postgresql://...
REDIS_URL=rediss://...
WORKER_CONCURRENCY=2
HEALTH_PORT=8080
SANDBOX_TIMEOUT_SECONDS=25
SANDBOX_MEMORY_LIMIT_MB=256
SANDBOX_CPU_LIMIT=1.0
EOF

# 3. Run the automated deployment script
./evaluator/deploy.sh
```

---

### Step 4: Verification & Live Health

The evaluator starts in detached mode and exposes its health monitor:

```bash
curl http://localhost:8080/health
```

Output:
```json
{
  "status": "healthy",
  "service": "algo-evaluator-worker",
  "concurrency": 2,
  "subsystems": {
    "redis": "connected",
    "postgres": "connected",
    "docker": "available (28.4.0)"
  },
  "queue": {
    "waiting": 0,
    "active": 0,
    "completed": 0,
    "failed": 0
  }
}
```

Now, any code submitted from your Vercel web application ([`https://algo-by-jason.vercel.app`](https://algo-by-jason.vercel.app)) will be pulled by this Oracle VM worker, executed in isolated Docker containers, and recorded on the live leaderboard!
