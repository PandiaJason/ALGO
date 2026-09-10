import { spawn, execSync } from "child_process";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { SupportedLanguage } from "../challenges/types";
import { SandboxExecutionResult } from "./lima-nsjail";

let cachedNsjailPath: string | null = null;
let lastCheckTime = 0;

/**
 * Locate the nsjail binary on the Linux host system.
 */
export function getNsjailPath(): string | null {
  if (cachedNsjailPath && fs.existsSync(cachedNsjailPath)) {
    return cachedNsjailPath;
  }

  const candidatePaths = [
    "/usr/local/bin/nsjail",
    "/usr/bin/nsjail",
    "/bin/nsjail",
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      cachedNsjailPath = p;
      return p;
    }
  }

  try {
    const stdout = execSync("which nsjail 2>/dev/null", { encoding: "utf-8" }).trim();
    if (stdout && fs.existsSync(stdout)) {
      cachedNsjailPath = stdout;
      return stdout;
    }
  } catch {
    // Not found
  }

  return null;
}

/**
 * Check whether native nsjail execution is available on this system.
 */
export function isNativeNsjailAvailable(): boolean {
  if (process.platform !== "linux") {
    return false;
  }

  const now = Date.now();
  if (now - lastCheckTime < 15000 && cachedNsjailPath !== null) {
    return true;
  }

  const nsjailPath = getNsjailPath();
  lastCheckTime = now;
  return nsjailPath !== null;
}

/**
 * Execute student code directly on the Linux host kernel using Google's nsjail.
 * Zero Docker overhead, instant startup (< 5ms), strict isolation:
 * - Namespaces: PID, Network, Mount, IPC, UTS, User
 * - Kernel address space limit (--rlimit_as) tailored per runtime
 * - CPU time limit (--rlimit_cpu)
 * - Wall-clock limit (--time_limit)
 * - Isolated read-only system mounts (/usr, /lib, /lib64, /etc, /bin, /dev)
 * - Ephemeral per-execution scratch directory, deleted on completion
 */
export async function runInNativeNsjail(
  code: string,
  language: SupportedLanguage,
  inputData: string,
  timeoutMs?: number
): Promise<SandboxExecutionResult> {
  const nsjailPath = getNsjailPath() || "/usr/local/bin/nsjail";

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

  // Address space limits in MB (64-bit JVM and Go runtime require larger virtual address reservations)
  const defaultMemoryLimitMap: Record<SupportedLanguage, number> = {
    python: 512,
    cpp: 512,
    rust: 512,
    go: 1024,
    java: 2048,
  };

  const memoryLimitMb = process.env.SANDBOX_MEMORY_LIMIT_MB
    ? parseInt(process.env.SANDBOX_MEMORY_LIMIT_MB, 10)
    : defaultMemoryLimitMap[language] || 512;

  const timeLimitSec = Math.max(Math.ceil(effectiveTimeoutMs / 1000), 2);
  const cpuLimitSec = Math.max(Math.floor(timeLimitSec * 0.8), 1);

  // Ephemeral workspace directory
  const execId = `algo-${randomUUID().slice(0, 8)}`;
  // Prefer /dev/shm if writable for ultra-fast RAM-based I/O
  const baseDir = fs.existsSync("/dev/shm") ? "/dev/shm" : "/tmp";
  const workDir = path.join(baseDir, execId);

  try {
    fs.mkdirSync(workDir, { recursive: true, mode: 0o777 });
  } catch (err: any) {
    return {
      stdout: "",
      stderr: `Failed to create sandbox working directory: ${err.message}`,
      exitCode: 1,
    };
  }

  const filenameMap: Record<SupportedLanguage, string> = {
    python: "solution.py",
    cpp: "solution.cpp",
    rust: "solution.rs",
    go: "main.go",
    java: "Solution.java",
  };
  const filename = filenameMap[language] || "solution.py";
  const sourcePath = path.join(workDir, filename);

  try {
    fs.writeFileSync(sourcePath, code, { encoding: "utf-8", mode: 0o666 });
  } catch (err: any) {
    try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
    return {
      stdout: "",
      stderr: `Failed to write solution source code: ${err.message}`,
      exitCode: 1,
    };
  }

  // Handle compilation phase for compiled languages
  let runCmd: string[] = [];

  try {
    switch (language) {
      case "python":
        runCmd = ["/usr/bin/python3", path.join(workDir, filename)];
        break;

      case "cpp": {
        const binPath = path.join(workDir, "solution");
        try {
          execSync(`g++ -O3 -std=c++20 "${sourcePath}" -o "${binPath}"`, {
            cwd: workDir,
            timeout: 15000,
            stdio: ["pipe", "pipe", "pipe"],
          });
        } catch (compileErr: any) {
          const compileStderr = compileErr.stderr?.toString() || compileErr.message;
          return { stdout: "", stderr: `Compilation Error:\n${compileStderr}`, exitCode: 1 };
        }
        runCmd = [binPath];
        break;
      }

      case "rust": {
        const binPath = path.join(workDir, "solution");
        try {
          execSync(`TMPDIR="${workDir}" rustc -C opt-level=3 "${sourcePath}" -o "${binPath}"`, {
            cwd: workDir,
            timeout: 20000,
            stdio: ["pipe", "pipe", "pipe"],
          });
        } catch (compileErr: any) {
          const compileStderr = compileErr.stderr?.toString() || compileErr.message;
          return { stdout: "", stderr: `Compilation Error:\n${compileStderr}`, exitCode: 1 };
        }
        runCmd = [binPath];
        break;
      }

      case "go": {
        const binPath = path.join(workDir, "solution");
        try {
          execSync(`go build -o "${binPath}" "${sourcePath}"`, {
            cwd: workDir,
            timeout: 15000,
            env: { ...process.env, GOCACHE: path.join(workDir, ".gocache") },
            stdio: ["pipe", "pipe", "pipe"],
          });
        } catch (compileErr: any) {
          const compileStderr = compileErr.stderr?.toString() || compileErr.message;
          return { stdout: "", stderr: `Compilation Error:\n${compileStderr}`, exitCode: 1 };
        }
        runCmd = [binPath];
        break;
      }

      case "java": {
        try {
          execSync(`javac -d "${workDir}" "${sourcePath}"`, {
            cwd: workDir,
            timeout: 15000,
            stdio: ["pipe", "pipe", "pipe"],
          });
        } catch (compileErr: any) {
          const compileStderr = compileErr.stderr?.toString() || compileErr.message;
          return { stdout: "", stderr: `Compilation Error:\n${compileStderr}`, exitCode: 1 };
        }
        runCmd = [
          "/usr/bin/java",
          "-Xmx192m",
          "-XX:+UseSerialGC",
          "-cp",
          workDir,
          "Solution",
        ];
        break;
      }

      default:
        runCmd = ["/usr/bin/python3", path.join(workDir, filename)];
    }
  } catch (err: any) {
    try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
    return {
      stdout: "",
      stderr: `Setup error: ${err.message}`,
      exitCode: 1,
    };
  }

  // Construct nsjail arguments
  const nsjailArgs = [
    "--log", "/dev/null",
    "-Mo",
    "--chroot", "/",
    "--time_limit", String(timeLimitSec),
    "--rlimit_cpu", String(cpuLimitSec),
    "--rlimit_as", String(memoryLimitMb),
    "--rlimit_nproc", "64",
    "-R", "/usr",
    "-R", "/lib",
    "-R", "/lib64",
    "-R", "/etc",
    "-R", "/bin",
    "-R", "/dev",
    "-B", workDir,
    "--cwd", workDir,
    "--",
    ...runCmd,
  ];

  return new Promise((resolve) => {
    // Sudo is used if non-root to allow configuring cgroups and isolated namespaces
    const isRoot = process.getuid ? process.getuid() === 0 : false;
    const spawnBinary = isRoot ? nsjailPath : "sudo";
    const spawnArgs = isRoot ? nsjailArgs : [nsjailPath, ...nsjailArgs];

    const proc = spawn(spawnBinary, spawnArgs);
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    // Safety watchdog on host side
    const watchdogTimer = setTimeout(() => {
      timedOut = true;
      try {
        proc.kill("SIGKILL");
      } catch {}
    }, (timeLimitSec + 2) * 1000);

    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    if (inputData) {
      proc.stdin.write(inputData);
    }
    proc.stdin.end();

    const cleanup = () => {
      clearTimeout(watchdogTimer);
      try {
        fs.rmSync(workDir, { recursive: true, force: true });
      } catch {}
    };

    proc.on("close", (exitCode) => {
      cleanup();
      const codeNum = exitCode ?? 0;
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
      cleanup();
      resolve({
        stdout,
        stderr: `Native nsjail execution error: ${err.message}`,
        exitCode: 1,
        timedOut: false,
        oomKilled: false,
      });
    });
  });
}
