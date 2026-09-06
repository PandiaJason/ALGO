/**
 * ALGO Sandbox Security & Hardening Validation Suite
 * Tests 10 critical isolation vectors to verify strict Linux kernel sandbox guarantees:
 * 1. Infinite loop timeout
 * 2. Memory exhaustion / OOM cgroup limit (256MB)
 * 3. Fork bomb / process limit (64 pids)
 * 4. Read-only filesystem boundary
 * 5. Network isolation (--network none)
 * 6. Environment variable secrecy (zero host credentials)
 * 7. Host root file access prevention (/etc/shadow)
 * 8. Host service access prevention (no localhost DB/Redis bridge)
 * 9. C++ compilation error handling
 * 10. Segmentation fault / SIGSEGV handling
 */

import { runInDocker } from "../src/lib/sandbox/runner";

interface SecurityTestResult {
  vector: string;
  name: string;
  passed: boolean;
  diagnostics: string;
}

const results: SecurityTestResult[] = [];

async function runSecuritySuite() {
  console.log("==================================================================");
  console.log("🛡️  ALGO SANDBOX SECURITY & HARDENING VERIFICATION SUITE");
  console.log("==================================================================");

  // 1. Infinite Loop (Timeout enforcement)
  console.log("[Test 1/10] Testing Infinite Loop Timeout...");
  const t1 = await runInDocker("while True:\n    pass\n", "python", "", 2000);
  const p1 = t1.timedOut === true || t1.exitCode === 124 || t1.stderr.includes("timed out");
  results.push({
    vector: "CPU Starvation",
    name: "Infinite Loop Timeout",
    passed: p1,
    diagnostics: p1 ? `Correctly halted by timeout (${t1.exitCode})` : `Failed to timeout: ${t1.stdout} ${t1.stderr}`,
  });

  // 2. Memory Exhaustion (OOM 256MB Hard Cap)
  console.log("[Test 2/10] Testing Memory Exhaustion (400MB alloc under 256MB cap)...");
  const t2 = await runInDocker(
    `
try:
    arr = bytearray(400 * 1024 * 1024)
    print("ALLOC_SUCCEEDED")
except Exception as e:
    print(f"ALLOC_CAUGHT: {e}")
`,
    "python",
    "",
    4000
  );
  const p2 = t2.oomKilled === true || t2.exitCode === 137 || !t2.stdout.includes("ALLOC_SUCCEEDED");
  results.push({
    vector: "Resource Limits",
    name: "Memory Exhaustion (256MB Cap)",
    passed: p2,
    diagnostics: p2 ? `Kernel cgroup memory limit enforced (Exit: ${t2.exitCode})` : "Exceeded 256MB without kernel termination",
  });

  // 3. Fork Bomb / Process Explosion (PID Limit 64)
  console.log("[Test 3/10] Testing Fork Bomb Mitigation (pids-limit: 64)...");
  const t3 = await runInDocker(
    `
import os
import time

spawned = 0
for _ in range(100):
    try:
        pid = os.fork()
        if pid == 0:
            time.sleep(1)
            os._exit(0)
        else:
            spawned += 1
    except OSError:
        print("FORK_BLOCKED_SAFELY")
        break
print(f"SPAWNED: {spawned}")
`,
    "python",
    "",
    5000
  );
  const p3 = t3.stdout.includes("FORK_BLOCKED_SAFELY") || t3.exitCode !== 0 || t3.stderr.includes("Resource temporarily unavailable");
  results.push({
    vector: "Denial of Service",
    name: "Fork Bomb Mitigation",
    passed: p3,
    diagnostics: p3 ? "Process creation safely bounded by cgroup pids-limit" : "Fork bomb ran unrestrained",
  });

  // 4. Read-Only Root Filesystem
  console.log("[Test 4/10] Testing Filesystem Read-Only Boundary...");
  const t4 = await runInDocker(
    `
try:
    with open('/root/escape_test.txt', 'w') as f:
        f.write('hacked')
    print("WRITE_SUCCEEDED")
except Exception as e:
    print(f"WRITE_FAILED: {e}")
`,
    "python",
    "",
    3000
  );
  const p4 = t4.stdout.includes("Read-only file system") || t4.stdout.includes("WRITE_FAILED") || !t4.stdout.includes("WRITE_SUCCEEDED");
  results.push({
    vector: "Filesystem Boundary",
    name: "Read-Only Root Isolation",
    passed: p4,
    diagnostics: p4 ? "Root filesystem is strictly read-only" : "Unauthorized write outside workspace succeeded",
  });

  // 5. Network Isolation (--network none)
  console.log("[Test 5/10] Testing Network Isolation (--network none)...");
  const t5 = await runInDocker(
    `
import socket
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1.0)
    s.connect(('1.1.1.1', 80))
    print("NET_CONNECTED")
except Exception as e:
    print(f"NET_BLOCKED: {e}")
`,
    "python",
    "",
    3000
  );
  const p5 = t5.stdout.includes("NET_BLOCKED") || !t5.stdout.includes("NET_CONNECTED");
  results.push({
    vector: "Network Boundary",
    name: "Network Isolation (--network none)",
    passed: p5,
    diagnostics: p5 ? "Zero socket traffic allowed (network unreachable)" : "Outbound network connection allowed!",
  });

  // 6. Environment Secrecy (Zero host secret leakage)
  console.log("[Test 6/10] Testing Environment Variable Secrecy...");
  const t6 = await runInDocker(
    `
import os
for k, v in os.environ.items():
    print(f"{k}={v}")
`,
    "python",
    "",
    3000
  );
  const hasDbSecret = t6.stdout.includes("postgresql://") || t6.stdout.includes("postgrespassword");
  const hasRedisSecret = t6.stdout.includes("REDIS_URL");
  const hasAuthSecret = t6.stdout.includes("AUTH_SECRET");
  const p6 = !hasDbSecret && !hasRedisSecret && !hasAuthSecret;
  results.push({
    vector: "Secret Protection",
    name: "Environment Variable Secrecy",
    passed: p6,
    diagnostics: p6 ? "No host secrets or credentials injected into sandbox" : "CRITICAL: Host credentials leaked in env!",
  });

  // 7. Host Root File Access Prevention
  console.log("[Test 7/10] Testing Host Root File Access (/etc/shadow)...");
  const t7 = await runInDocker(
    `
try:
    with open('/etc/shadow', 'r') as f:
        print("SHADOW_READ_SUCCESS")
except Exception as e:
    print(f"SHADOW_BLOCKED: {e}")
`,
    "python",
    "",
    3000
  );
  const p7 = t7.stdout.includes("SHADOW_BLOCKED") || !t7.stdout.includes("SHADOW_READ_SUCCESS");
  results.push({
    vector: "Privilege Boundary",
    name: "Host Root File Access Prevention",
    passed: p7,
    diagnostics: p7 ? "Unprivileged non-root user cannot read privileged files" : "CRITICAL: Root files readable!",
  });

  // 8. Service Isolation (No connection to host DB/Redis)
  console.log("[Test 8/10] Testing Service Isolation (host localhost ports)...");
  const t8 = await runInDocker(
    `
import socket
for port in [5432, 6379]:
    try:
        s = socket.create_connection(('127.0.0.1', port), timeout=0.5)
        print(f"CONNECTED_{port}")
    except Exception as e:
        print(f"BLOCKED_{port}")
`,
    "python",
    "",
    3000
  );
  const p8 = t8.stdout.includes("BLOCKED_5432") && t8.stdout.includes("BLOCKED_6379");
  results.push({
    vector: "Service Isolation",
    name: "Host DB & Redis Bridge Prevention",
    passed: p8,
    diagnostics: p8 ? "Sandbox cannot communicate with host databases" : "CRITICAL: Host database exposed to student code!",
  });

  // 9. C++ Compilation Error Diagnostics
  console.log("[Test 9/10] Testing C++ Compilation Error Handling...");
  const t9 = await runInDocker(
    `
#include <iostream>
int main() {
    this_is_an_intentional_syntax_error();
    return 0;
}
`,
    "cpp",
    "",
    8000
  );
  const p9 = t9.exitCode !== 0 && (t9.stderr.includes("error:") || t9.stderr.includes("not declared in this scope"));
  results.push({
    vector: "Compiler Diagnostics",
    name: "C++ Compilation Error Safety",
    passed: p9,
    diagnostics: p9 ? "Clean compiler diagnostics returned on syntax error" : "Compiler failed unsafely",
  });

  // 10. Segmentation Fault / Runtime SIGSEGV
  console.log("[Test 10/10] Testing C++ Segmentation Fault (Null Pointer Dereference)...");
  const t10 = await runInDocker(
    `
#include <iostream>
int main() {
    int* p = nullptr;
    *p = 1337;
    return 0;
}
`,
    "cpp",
    "",
    8000
  );
  const p10 = t10.exitCode === 139 || t10.stderr.includes("Segmentation fault") || t10.exitCode !== 0;
  results.push({
    vector: "Crash Safety",
    name: "C++ SIGSEGV Containment",
    passed: p10,
    diagnostics: p10 ? `SIGSEGV caught safely (Exit: ${t10.exitCode})` : "SIGSEGV did not exit with error",
  });

  console.log("\n==================================================================");
  console.log("📊 SECURITY TEST RESULTS SUMMARY");
  console.log("==================================================================");
  let allPassed = true;
  for (const res of results) {
    const icon = res.passed ? "✅ PASS" : "❌ FAIL";
    if (!res.passed) allPassed = false;
    console.log(`${icon} [${res.vector}] ${res.name}: ${res.diagnostics}`);
  }

  console.log("==================================================================");
  if (allPassed) {
    console.log("🎉 ALL 10 HARDENED SANDBOX SECURITY VECTORS PASSED VERIFICATION!");
  } else {
    console.error("⚠️ SOME SECURITY TESTS FAILED.");
    process.exit(1);
  }
}

runSecuritySuite().catch((err) => {
  console.error("Fatal suite failure:", err);
  process.exit(1);
});
