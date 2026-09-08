import { spawn, execSync } from "child_process";
import { randomUUID } from "crypto";
import fs from "fs";
import { SupportedLanguage } from "../challenges/types";

const LIMA_INSTANCE_NAME = process.env.LIMA_INSTANCE_NAME || "algo-runner";

/**
 * Resolve the path to the limactl binary on the macOS host.
 */
function getLimactlPath(): string {
  if (fs.existsSync("/opt/homebrew/bin/limactl")) {
    return "/opt/homebrew/bin/limactl";
  }
  if (fs.existsSync("/usr/local/bin/limactl")) {
    return "/usr/local/bin/limactl";
  }
  return "limactl";
}

let lastCheckTime = 0;
let cachedLimaRunning = false;

/**
 * Check whether the configured Lima instance is running.
 * Caches status for 10 seconds to eliminate repeated status command overhead.
 */
export function isLimaAvailable(): boolean {
  const now = Date.now();
  if (now - lastCheckTime < 10000 && lastCheckTime > 0) {
    return cachedLimaRunning;
  }

  try {
    const limactl = getLimactlPath();
    const stdout = execSync(`${limactl} list ${LIMA_INSTANCE_NAME} --json 2>/dev/null`, {
      encoding: "utf-8",
      timeout: 3000,
    });
    const info = JSON.parse(stdout);
    cachedLimaRunning = info.status === "Running";
    lastCheckTime = now;
    return cachedLimaRunning;
  } catch {
    cachedLimaRunning = false;
    lastCheckTime = now;
    return false;
  }
}

export interface SandboxExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut?: boolean;
  oomKilled?: boolean;
}

/**
 * Execute student code inside the persistent Lima Debian ARM64 VM using Google's nsjail.
 *
 * Enforces:
 * - Isolated Linux namespaces: PID, Network, Mount, IPC, UTS, User
 * - Kernel address space limit (--rlimit_as)
 * - CPU time limit (--rlimit_cpu)
 * - Wall-clock limit (--time_limit)
 * - Ephemeral execution scratchpad inside the VM, cleaned up on exit
 */
export async function runInLimaNsjail(
  code: string,
  language: SupportedLanguage,
  inputData: string,
  timeoutMs?: number
): Promise<SandboxExecutionResult> {
  const defaultTimeoutMap: Record<SupportedLanguage, number> = {
    python: 4000,
    cpp: 6000,
    rust: 8000,
    go: 6000,
    java: 6000,
  };

  const defaultTimeout = defaultTimeoutMap[language] || 4000;
  const effectiveTimeoutMs = timeoutMs ?? (
    process.env.SANDBOX_TIMEOUT_SECONDS
      ? parseInt(process.env.SANDBOX_TIMEOUT_SECONDS, 10) * 1000
      : defaultTimeout
  );

  const memoryLimitMb = process.env.SANDBOX_MEMORY_LIMIT_MB
    ? parseInt(process.env.SANDBOX_MEMORY_LIMIT_MB, 10)
    : 256;

  const timeLimitSec = Math.max(Math.ceil(effectiveTimeoutMs / 1000), 2);
  const cpuLimitSec = Math.max(Math.floor(timeLimitSec * 0.8), 1);

  const execId = `algo-${randomUUID().slice(0, 8)}`;
  const workDir = `/tmp/${execId}`;
  const encodedCode = Buffer.from(code).toString("base64");

  const filenameMap: Record<SupportedLanguage, string> = {
    python: "solution.py",
    cpp: "solution.cpp",
    rust: "solution.rs",
    go: "main.go",
    java: "Solution.java",
  };
  const filename = filenameMap[language] || "solution.py";

  let compileCmd = "";
  let runCmd = "";

  switch (language) {
    case "python":
      runCmd = `/usr/bin/python3 ${workDir}/${filename}`;
      break;
    case "cpp":
      compileCmd = `g++ -O3 -std=c++20 ${workDir}/${filename} -o ${workDir}/solution`;
      runCmd = `${workDir}/solution`;
      break;
    case "rust":
      compileCmd = `rustc -C opt-level=3 ${workDir}/${filename} -o ${workDir}/solution`;
      runCmd = `${workDir}/solution`;
      break;
    case "go":
      compileCmd = `export GOCACHE=${workDir}/.gocache && go build -o ${workDir}/solution ${workDir}/${filename}`;
      runCmd = `${workDir}/solution`;
      break;
    case "java":
      compileCmd = `javac -d ${workDir} ${workDir}/${filename}`;
      runCmd = `/usr/bin/java -Xmx192m -XX:+UseSerialGC -cp ${workDir} Solution`;
      break;
    default:
      runCmd = `/usr/bin/python3 ${workDir}/${filename}`;
  }

  // Construct bash script executed inside Lima VM
  const script = `
set -e
mkdir -p ${workDir}
trap 'rm -rf ${workDir}' EXIT

echo "${encodedCode}" | base64 -d > ${workDir}/${filename}

${compileCmd ? `${compileCmd}\n` : ""}

sudo nsjail --log /dev/null \\
  --mode o \\
  --chroot / \\
  --time_limit ${timeLimitSec} \\
  --rlimit_cpu ${cpuLimitSec} \\
  --rlimit_as ${memoryLimitMb} \\
  --rlimit_nproc 64 \\
  --bindmount_ro /usr \\
  --bindmount_ro /lib \\
  --bindmount_ro /lib64 \\
  --bindmount_ro /etc \\
  --bindmount_ro ${workDir} \\
  --cwd ${workDir} \\
  -- ${runCmd}
`;

  const limactl = getLimactlPath();

  return new Promise((resolve) => {
    const proc = spawn(limactl, ["shell", LIMA_INSTANCE_NAME, "bash", "-c", script]);
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    // Safety watchdog on host side: 2 seconds longer than inner timeout
    const watchdogTimer = setTimeout(() => {
      timedOut = true;
      try {
        proc.kill("SIGKILL");
      } catch {
        // Ignore kill errors
      }
    }, (timeLimitSec + 2) * 1000);

    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    if (inputData) {
      proc.stdin.write(inputData);
    }
    proc.stdin.end();

    proc.on("close", (exitCode) => {
      clearTimeout(watchdogTimer);
      const codeNum = exitCode ?? 0;

      // nsjail or watchdog killed by SIGKILL (128 + 9 = 137) or exitCode 124
      const wasTimedOut = timedOut || codeNum === 137 || codeNum === 124;
      const wasOom = codeNum === 137 && stderr.toLowerCase().includes("memory");

      let errMessage = stderr;
      if (wasTimedOut) {
        errMessage = `Execution timed out after ${timeLimitSec}s (limit exceeded).`;
      } else if (wasOom) {
        errMessage = `Memory limit exceeded (${memoryLimitMb}MB cap). Process killed by kernel.`;
      }

      resolve({
        stdout,
        stderr: errMessage,
        exitCode: wasTimedOut ? 124 : codeNum,
        timedOut: wasTimedOut,
        oomKilled: wasOom,
      });
    });

    proc.on("error", (err) => {
      clearTimeout(watchdogTimer);
      resolve({
        stdout,
        stderr: `Lima execution error: ${err.message}`,
        exitCode: 1,
        timedOut: false,
        oomKilled: false,
      });
    });
  });
}
