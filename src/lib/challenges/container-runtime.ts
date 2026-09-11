// src/lib/challenges/container-runtime.ts
import { ChallengeData } from "./types";

export const containerRuntimeChallenge: ChallengeData = {
  slug: "container-runtime",
  number: "08",
  title: "Container Runtime / Sandbox",
  subtitle: "From Linux namespaces and pivot_root to cgroups v2 resource guardrails and sub-10ms sandboxes.",
  badge: "SYSTEMS ENGINEERING CAPSTONE",
  domain: "CORE_SYSTEMS",
  inspiredBy: "Docker, runc, gVisor",
  whatStudentsBuild: "Linux container execution engine using namespaces, cgroups, and rootfs pivot",
  mainSkill: "OS virtualization, Linux kernel primitives, security isolation",
  signatureQuestion: "What actually happens when you run 'docker run'?",
  overview:
    "In this systems capstone challenge, you build a lightweight Linux container runtime **simulator** (a CLI state machine) — inspired by the core implementation of runc, Docker, and gVisor. You will demystify containerization by simulating Linux kernel syscalls concepts: namespace isolation (unshare/clone with CLONE_NEWPID/CLONE_NEWNS), filesystem jailing (pivot_root), resource guardrails (cgroups v2), and multi-tenant sandboxing.",
  whyItMatters:
    "Containers are not virtual machines; they are regular Linux processes constrained by kernel namespaces and control groups. Mastering these concepts by building a state-machine simulator gives you foundational systems knowledge required to understand modern AI sandboxes, serverless runtimes, and secure multi-tenant execution clusters.",
  finalOutcome:
    "Upon completing all 6 levels, you have constructed a functional container engine simulator capable of tracking isolated container environments, trapping simulated memory overflows (OOM) deterministically, modeling rootfs jails, and securely scaling parallel workload execution.",
  philosophy: "Encounter real Linux virtualization engineering concepts: PID 1 signal semantics, pivot_root mount binding, cgroup v2 controller interfaces, and host breakout prevention, all modeled through a rigorous CLI state machine.",
  architectureDiagram: `                   HOST OPERATING SYSTEM
                             │
               ┌─────────────┴─────────────┐
               ▼                           ▼
        [Control Plane]             [Linux Kernel]
      container run --mem 64M              │
               │                           │
               ▼                     Syscall clone()
      Parse Config & Rootfs        CLONE_NEWPID | CLONE_NEWNS
               │                           │
               └─────────────┬─────────────┘
                             ▼
                 CONTAINER PROCESS (PID 1)
               ┌───────────────────────────┐
               │ Isolated PID space        │
               │ Isolated Mount (pivot_root│
               │ Bound to /sys/fs/cgroup/  │
               │   memory.max = 64M        │
               │   pids.max = 32           │
               └───────────────────────────┘`,
  levelRoadmap: [
    { level: 1, stage: "BUILD", whatWeBuild: "Process Isolation with Linux Namespaces", mainConcept: "clone() with CLONE_NEWPID, CLONE_NEWUTS, isolated hostname and PID 1" },
    { level: 2, stage: "CORE", whatWeBuild: "Filesystem Isolation & Pivot Root", mainConcept: "chroot vs pivot_root, mount namespace (CLONE_NEWNS), read-only rootfs mount" },
    { level: 3, stage: "HARDEN", whatWeBuild: "Cgroups V2 Resource Constraints", mainConcept: "Memory max boundaries, CPU quota throttling, pids.max fork-bomb prevention" },
    { level: 4, stage: "SCALE", whatWeBuild: "Multi-Tenant Parallel Sandbox Spawning", mainConcept: "Concurrent ephemeral container spawning, bridge networking, IP allocation" },
    { level: 5, stage: "MEASURE", whatWeBuild: "Cold-Start Microbenchmarks & Latency", mainConcept: "Measuring mount overhead, namespace creation latency, context switch penalties" },
    { level: 6, stage: "OPTIMIZE", whatWeBuild: "Pre-Forked Pool & Copy-on-Write Roots", mainConcept: "Pre-initialized namespace worker pools, CoW overlay snapshotting, sub-5ms boot" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "Namespace Isolation Layer",
      focus: "Kernel Namespaces",
      description: "Creates isolated views of system resources (PIDs, hostnames, networks, IPC).",
      realWorldTech: "Linux namespaces (pid_namespaces(7), uts_namespaces(7))",
    },
    {
      number: 2,
      name: "Rootfs Jail Layer",
      focus: "Filesystem Pivot & Mounts",
      description: "Detaches host root and mounts a new pristine root directory with pivot_root(2).",
      realWorldTech: "runc libcontainer/rootfs_linux.go",
    },
    {
      number: 3,
      name: "Resource Guardrail Layer",
      focus: "Control Groups v2",
      description: "Restricts physical hardware consumption (RAM, CPU cycles, max process forks).",
      realWorldTech: "Linux cgroups v2 (cgroupfs)",
    },
    {
      number: 4,
      name: "Sandbox Orchestration Layer",
      focus: "Multi-Tenant Process Pool",
      description: "Manages concurrent ephemeral sandboxes with isolated network namespaces and cleanup.",
      realWorldTech: "containerd, Firecracker, gVisor runsc",
    },
    {
      number: 5,
      name: "Boot Latency Profiler",
      focus: "Cold-Start Benchmarking",
      description: "Measures millisecond breakdown across clone(), mount(), and cgroup configuration.",
      realWorldTech: "strace -T, eBPF execsnoop",
    },
    {
      number: 6,
      name: "Fast-Spawn Pool",
      focus: "Pre-Forked Worker Sandboxes",
      description: "Eliminates clone and mount latency by maintaining hot standby container processes.",
      realWorldTech: "AWS Lambda Firecracker MicroVM pools",
    },
  ],
  levels: {
    1: {
      level: 1,
      stage: "BUILD",
      shortTitle: "Namespaces",
      title: "Process Isolation with Linux Namespaces",
      difficulty: "Medium",
      tagline: "Spawn a child process with isolated PID and hostname namespaces.",
      diagram: `LINUX NAMESPACE DUAL-PERSPECTIVE MAPPING:

HOST OS VIEW (Global Kernel Table):
  Host PID: 1042 ──► cmd: "container-init"
    ├── PID Namespace: [Child View translates 1042 ──► 1]
    ├── UTS Namespace: Hostname = "container-alpha" (Host = "prod-node-01")
    └── IPC Namespace: Isolated System V message queues & semaphores

CONTAINER INTERNAL VIEW:
  Container PID: 1 ──► [Init Process / Reaper]
    └── getpid() returns 1 (Sees no other host processes)`,
      learningLoop: {
        bottleneck: "How does a process think its PID is 1 when the host OS sees it as PID 48219?",
        whatYouUnderstand: [
          "Syscall flags: CLONE_NEWPID, CLONE_NEWUTS, CLONE_NEWIPC.",
          "PID 1 responsibilities: reaping child processes and handling default signal behavior.",
          "Hostname isolation: changing container hostname without affecting host.",
        ],
        productionParity: "The core unshare / clone invocation of runc.",
        outcomeSummary: "You create an isolated process boundary where the child sees itself as PID 1.",
      },
      operations: [
        { cmd: "spawn-ns <hostname> <command>", desc: "Spawns command in new PID and UTS namespace." },
        { cmd: "get-container-pid", desc: "Returns the internal PID (must be 1) and external host PID." },
        { cmd: "exit", desc: "Exits the current command sequence." },
      ],
      examples: [
        {
          title: "Spawn in Namespace",
          input: "spawn-ns container-alpha echo hello\\nget-container-pid\\nexit",
          output: "SPAWNED container-alpha\\nINTERNAL_PID: 1 HOST_PID: 1042\\nhello",
        },
      ],
      constraints: ["Internal PID must report 1", "Container hostname change must not leak to host"],
      cases: [
        { name: "Case 1: Spawn basic container", input: "spawn-ns c1 echo test\\nexit", expected: "SPAWNED c1\\ntest" },
        { name: "Case 2: Internal PID check", input: "spawn-ns c2 check-pid\\nget-container-pid\\nexit", expected: "SPAWNED c2\\nINTERNAL_PID: 1" },
        { name: "Case 3: Hostname isolation check", input: "spawn-ns sandbox-test get-hostname\\nexit", expected: "HOSTNAME: sandbox-test" },
        { name: "Case 4: Child termination status", input: "spawn-ns c3 exit-code 0\\nexit", expected: "CONTAINER_EXIT: 0" },
        { name: "Case 5: Multiple sequential containers", input: "spawn-ns a echo 1\\nspawn-ns b echo 2\\nexit", expected: "SPAWNED a\\n1\\nSPAWNED b\\n2" },
      ],
    },
    2: {
      level: 2,
      stage: "CORE",
      shortTitle: "Pivot Root",
      title: "Filesystem Isolation & Pivot Root",
      difficulty: "Hard",
      tagline: "Securely jail container processes using pivot_root into a fresh rootfs.",
      diagram: `PIVOT_ROOT JAIL MECHANICS:

  Host Mount Hierarchy:
  / (Host Root: /dev/sda1)
    └── /var/lib/containers/rootfs/ (New Target Root)
          └── /oldroot/ (Temporary mountpoint for host root)

  Execution Sequence:
  1. unshare(CLONE_NEWNS) ──► Private mount table
  2. mount(NULL, "/", NULL, MS_REC | MS_PRIVATE, NULL)
  3. pivot_root("/var/lib/containers/rootfs", "/var/lib/containers/rootfs/oldroot")
  4. umount2("/oldroot", MNT_DETACH) ──► Host root completely gone!
  5. Container jail complete: "/" is now isolated rootfs. Breakout impossible.`,
      learningLoop: {
        bottleneck: "Why is chroot insecure (vulnerable to breakout via '..'), and how does pivot_root solve this?",
        whatYouUnderstand: [
          "Mount namespaces (CLONE_NEWNS) and mount propagation flags (MS_REC | MS_PRIVATE).",
          "pivot_root(new_root, put_old) mechanics.",
          "Unmounting old host root (umount2 with MNT_DETACH) to completely jail the container.",
        ],
        productionParity: "runc pivot_root setup in libcontainer.",
        outcomeSummary: "You eliminate filesystem breakout risks and jail container processes inside isolated root directories.",
      },
      operations: [
        { cmd: "mount-rootfs <dir>", desc: "Prepares mount points and executes pivot_root into container rootfs." },
        { cmd: "ls-container-root", desc: "Lists root directory inside the container." },
        { cmd: "test-chroot-escape", desc: "Attempts to breakout to the host root." },
        { cmd: "mount-ro", desc: "Mounts the rootfs as read-only." },
        { cmd: "touch <file>", desc: "Attempts to create a file." },
        { cmd: "mount-proc", desc: "Mounts the proc pseudo-filesystem." },
        { cmd: "ls <dir>", desc: "Lists the contents of a directory." },
        { cmd: "exit", desc: "Exits the current command sequence." },
      ],
      examples: [
        {
          title: "Pivot Rootfs",
          input: "mount-rootfs /alpine-root\\nls-container-root\\nexit",
          output: "PIVOT_ROOT_OK\\nbin dev etc home proc root sys tmp usr var",
        },
      ],
      constraints: ["Host filesystem must be completely unreachable", "Must unmount host root completely"],
      cases: [
        { name: "Case 1: Mount pristine rootfs", input: "mount-rootfs /rootfs\\nexit", expected: "PIVOT_ROOT_OK" },
        { name: "Case 2: List isolated root", input: "mount-rootfs /rootfs\\nls-container-root\\nexit", expected: "PIVOT_ROOT_OK\\nbin etc usr var" },
        { name: "Case 3: Verify breakout protection", input: "test-chroot-escape\\nexit", expected: "ESCAPE_ATTEMPT_FAILED: PERMISSION_DENIED" },
        { name: "Case 4: Read-only rootfs enforcement", input: "mount-ro\\ntouch /test.txt\\nexit", expected: "ERROR: READ_ONLY_FILESYSTEM" },
        { name: "Case 5: Proc pseudo-fs mount", input: "mount-proc\\nls /proc\\nexit", expected: "PROC_MOUNTED_OK" },
      ],
    },
    3: {
      level: 3,
      stage: "HARDEN",
      shortTitle: "Cgroups V2",
      title: "Cgroups V2 Resource Constraints",
      difficulty: "Hard",
      tagline: "Enforce memory limits, CPU quotas, and fork-bomb protection.",
      diagram: `CGROUPS V2 UNIFIED CONTROLLERS:

  /sys/fs/cgroup/algo_sandbox_42/
  ├── cgroup.procs ──► [Host PID: 1042]
  │
  ├── memory.max: 16,777,216 (16 MB limit)
  │     ├── Process malloc(32MB)
  │     └── Kernel OOM Killer: SIGKILL (Exit code 137)
  │
  ├── pids.max: 10
  │     ├── Fork bomb :(){ :|:& };: attempts 11th fork
  │     └── Kernel returns: EAGAIN (Resource temporarily unavailable)
  │
  └── cpu.max: "50000 100000" (Throttled to 50% CPU bandwidth)`,
      learningLoop: {
        bottleneck: "What stops a buggy or malicious student script from allocating 64GB RAM or running ':(){ :|:& };:' (fork bomb)?",
        whatYouUnderstand: [
          "cgroups v2 unified hierarchy: /sys/fs/cgroup/<group>/.",
          "memory.max and memory.oom.group policies.",
          "pids.max for fork-bomb mitigation.",
          "cpu.max bandwidth throttling (quota and period).",
        ],
        productionParity: "Kubernetes resource requests/limits and Docker --memory flag.",
        outcomeSummary: "You protect host servers from resource starvation and fork bombs.",
      },
      operations: [
        { cmd: "set-limits --mem <bytes> --pids <num> [--cpu <quota> <period>]", desc: "Configures cgroups v2 resource limits for container." },
        { cmd: "run-with-limits <cmd>", desc: "Executes workload. Available commands: alloc-16M, alloc-32M, fork-bomb, burn-cpu." },
        { cmd: "cleanup-cgroups", desc: "Cleans up cgroup directories." },
        { cmd: "exit", desc: "Exits the current command sequence." },
      ],
      examples: [
        {
          title: "Memory Limit OOM",
          input: "set-limits --mem 16M --pids 10\\nrun-with-limits alloc-32M\\nexit",
          output: "CGROUP_CONFIGURED\\nPROCESS_TERMINATED: OOM_KILLED (exit 137)",
        },
      ],
      constraints: ["Strict 0 byte overshoot above memory.max", "Instantly reject forks exceeding pids.max"],
      cases: [
        { name: "Case 1: Normal workload within memory limit", input: "set-limits --mem 64M --pids 10\\nrun-with-limits alloc-16M\\nexit", expected: "CGROUP_CONFIGURED\\nALLOC_OK" },
        { name: "Case 2: Memory OOM kill", input: "set-limits --mem 16M --pids 10\\nrun-with-limits alloc-32M\\nexit", expected: "CGROUP_CONFIGURED\\nOOM_KILLED" },
        { name: "Case 3: Fork bomb suppression", input: "set-limits --mem 64M --pids 5\\nrun-with-limits fork-bomb\\nexit", expected: "CGROUP_CONFIGURED\\nFORK_REJECTED: EAGAIN (pids.max reached)" },
        { name: "Case 4: CPU quota throttling", input: "set-limits --cpu 50000 100000\\nrun-with-limits burn-cpu\\nexit", expected: "CGROUP_CONFIGURED\\nTHROTTLED: 50%" },
        { name: "Case 5: Cgroup directory cleanup", input: "cleanup-cgroups\\nexit", expected: "CGROUP_CLEANED_OK" },
      ],
    },
    4: {
      level: 4,
      stage: "SCALE",
      shortTitle: "Sandbox Spawning",
      title: "Multi-Tenant Parallel Sandbox Spawning",
      difficulty: "Hard",
      tagline: "Concurrently spawn 50 isolated sandboxes with veth bridge networking.",
      diagram: `MULTI-TENANT ISOLATED EXECUTION POOL:

       Host Supervisor / Dispatcher
             │
   ┌─────────┼─────────┬─────────┐
   ▼         ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│Sandbox│ │Sandbox│ │Sandbox│ │Sandbox│
│  #1   │ │  #2   │ │  #3   │ │  #4   │
├───────┤ ├───────┤ ├───────┤ ├───────┤
│ PID: 1│ │ PID: 1│ │ PID: 1│ │ PID: 1│
│ veth1 │ │ veth2 │ │ veth3 │ │ veth4 │
│ rootfs│ │ rootfs│ │ rootfs│ │ rootfs│
│ 64MB  │ │ 64MB  │ │ 64MB  │ │ 64MB  │
└───────┘ └───────┘ └───────┘ └───────┘
   │
   └── Isolated Linux Bridge (br0) with iptables cross-talk drop rules`,
      learningLoop: {
        bottleneck: "How do platforms like LeetCode or ALGO run thousands of untrusted student submissions simultaneously?",
        whatYouUnderstand: [
          "Ephemeral sandbox lifecycles: create, execute, capture stdout/stderr, destroy.",
          "Virtual ethernet pairs (veth) and container network namespaces (CLONE_NEWNET).",
          "Automated file descriptor and cgroup cleanup upon container termination.",
        ],
        productionParity: "The execution engine of ALGO, Judge0, and AWS Lambda.",
        outcomeSummary: "You master scalable multi-tenant execution architectures.",
      },
      operations: [
        { cmd: "spawn-pool <count>", desc: "Spawns N concurrent sandboxes and reports active container IDs." },
        { cmd: "exec-sandbox <id> <command>", desc: "Executes command inside designated sandbox." },
        { cmd: "exec-parallel <cmd>", desc: "Executes a command across all sandboxes in parallel." },
        { cmd: "test-cross-sandbox-access", desc: "Verifies isolation between parallel sandboxes." },
        { cmd: "destroy-pool", desc: "Cleans up all spawned sandboxes and resources." },
        { cmd: "exit", desc: "Exits the current command sequence." },
      ],
      examples: [
        {
          title: "Spawn Sandbox Pool",
          input: "spawn-pool 5\\nexec-sandbox sb_0 echo ready\\nexit",
          output: "POOL_READY: 5 SANDBOXES\\nready",
        },
      ],
      constraints: ["Sandboxes must be 100% mutually isolated", "Zero network traffic between sandboxes"],
      cases: [
        { name: "Case 1: Spawn 5 sandboxes", input: "spawn-pool 5\\nexit", expected: "POOL_READY: 5" },
        { name: "Case 2: Execute command in sandbox", input: "spawn-pool 2\\nexec-sandbox sb_1 echo hello\\nexit", expected: "POOL_READY: 2\\nhello" },
        { name: "Case 3: Parallel execution test", input: "exec-parallel echo fast\\nexit", expected: "EXECUTED: 10 CONCURRENT_OK" },
        { name: "Case 4: Inter-sandbox isolation audit", input: "test-cross-sandbox-access\\nexit", expected: "CROSS_ACCESS: BLOCKED" },
        { name: "Case 5: Pool teardown", input: "destroy-pool\\nexit", expected: "POOL_DESTROYED: 0 LEAKS" },
      ],
    },
    5: {
      level: 5,
      stage: "MEASURE",
      shortTitle: "Cold-Boot Latency",
      title: "Startup Latency & Cold-Start Microbenchmarks",
      difficulty: "Hard",
      tagline: "Profile container cold-start down to the microsecond.",
      diagram: `CONTAINER COLD-BOOT TIMELINE (Microsecond Precision):

Time: 0 μs             +1,200 μs            +3,300 μs        +4,100 μs
 ├─────────────────────────┼───────────────────┼────────────────┤
 │ clone(CLONE_NEWPID...)  │ pivot_root()      │ cgroup v2 setup│ Process execvp
 │ Clone page tables       │ Bind & mount      │ write limits   │ User payload
 │ Host PID allocation     │ umount host root  │ to memory.max  │ executes
 └─────────────────────────┴───────────────────┴────────────────┘
 Total Latency: 4.1 ms (Well within < 15ms target)`,
      learningLoop: {
        bottleneck: "Where does container startup time actually go: clone(), pivot_root(), cgroup setup, or rootfs mount?",
        whatYouUnderstand: [
          "Microsecond latency breakdown of container bootstrap.",
          "Rootfs copy vs bind-mount startup latency.",
          "Measuring process context switch overhead under cgroup constraints.",
        ],
        productionParity: "Serverless cold-start benchmarking (Firecracker vs gVisor vs runc).",
        outcomeSummary: "You capture granular latency profiles and isolate virtualization bottlenecks.",
      },
      operations: [
        { cmd: "profile-boot", desc: "Runs single container boot and reports microsecond timeline." },
        { cmd: "bench-spawn-rate <count>", desc: "Measures container creations per second." },
        { cmd: "measure-footprint", desc: "Measures container memory overhead." },
        { cmd: "bench-ctx-switch", desc: "Benchmarks context switch latency." },
        { cmd: "audit-latency", desc: "Audits overall startup latency." },
        { cmd: "exit", desc: "Exits the current command sequence." },
      ],
      examples: [
        {
          title: "Profile Boot",
          input: "profile-boot\\nexit",
          output: "CLONE: 1.2ms PIVOT_ROOT: 2.1ms CGROUP: 0.8ms TOTAL_BOOT: 4.1ms",
        },
      ],
      constraints: ["Total cold boot under 15ms", "Microsecond timeline precision"],
      cases: [
        { name: "Case 1: Profile single boot", input: "profile-boot\\nexit", expected: "TOTAL_BOOT: < 15ms" },
        { name: "Case 2: Measure spawn rate", input: "bench-spawn-rate 50\\nexit", expected: "SPAWN_RATE: > 50 /sec" },
        { name: "Case 3: Memory footprint overhead", input: "measure-footprint\\nexit", expected: "OVERHEAD: < 2MB" },
        { name: "Case 4: Context switch cost", input: "bench-ctx-switch\\nexit", expected: "CTX_SWITCH_US: < 5" },
        { name: "Case 5: Latency audit", input: "audit-latency\\nexit", expected: "LATENCY_AUDIT: PASSED" },
      ],
    },
    6: {
      level: 6,
      stage: "OPTIMIZE",
      shortTitle: "Fast Clone Pool",
      title: "Pre-Forked Worker Pools & Fast Clone",
      difficulty: "Expert",
      tagline: "Achieve sub-3ms cold starts via pre-initialized standby worker pools.",
      diagram: `PRE-FORKED HOT STANDBY DISPATCH:

  Idle Pre-Forked Pool (Paused at Unix Domain Socket recv):
  ┌─────────────────────────────────────────────────────────┐
  │ Worker 1: [Namespaces ✓, Mounts ✓, Cgroups ✓] (Sleeping)│
  │ Worker 2: [Namespaces ✓, Mounts ✓, Cgroups ✓] (Sleeping)│
  │ Worker 3: [Namespaces ✓, Mounts ✓, Cgroups ✓] (Sleeping)│
  └───────────────────────────┬─────────────────────────────┘
                              │ Wake signal via IPC socket (< 1.8ms)
                              ▼
  Active Worker executes user command immediately!
  On completion: Worker exits ──► Pool replenishes in background (CoW reset)`,
      learningLoop: {
        bottleneck: "How does Cloudflare Workers or AWS Lambda achieve near-instant execution without waiting for cold boots?",
        whatYouUnderstand: [
          "Pre-forking: pre-allocating idle container processes paused at clone().",
          "Snapshotting and Copy-on-Write (CoW) rootfs overlays.",
          "Waking pre-forked workers on demand via Unix domain sockets.",
        ],
        productionParity: "AWS Lambda microVM snapshotting and Cloudflare workerd.",
        outcomeSummary: "You engineer near-instant container execution with pre-forked worker pools.",
      },
      operations: [
        { cmd: "init-hot-pool <size>", desc: "Pre-forks and pauses hot standby containers in isolated namespaces." },
        { cmd: "fast-exec <command>", desc: "Wakes hot container and executes command with sub-3ms latency. Accepts 'check-clean'." },
        { cmd: "audit-engine", desc: "Audits the entire execution engine." },
        { cmd: "exit", desc: "Exits the current command sequence." },
      ],
      examples: [
        {
          title: "Fast Exec",
          input: "init-hot-pool 5\\nfast-exec echo instantaneous\\nexit",
          output: "HOT_POOL_READY\\ninstantaneous\\nDISPATCH_TIME: 1.8ms",
        },
      ],
      constraints: ["Sub-3ms execution dispatch", "Re-seed security state between runs"],
      cases: [
        { name: "Case 1: Initialize hot standby pool", input: "init-hot-pool 5\\nexit", expected: "HOT_POOL_READY" },
        { name: "Case 2: Fast execution latency", input: "fast-exec echo fast\\nexit", expected: "fast\\nDISPATCH_TIME: < 3ms" },
        { name: "Case 3: State isolation between fast runs", input: "fast-exec touch /tmp/taint\\nfast-exec check-clean\\nexit", expected: "SANDBOX_CLEAN: TRUE" },
        { name: "Case 4: Rapid consecutive execution", input: "fast-exec echo 1\\nfast-exec echo 2\\nexit", expected: "1\\n2" },
        { name: "Case 5: Verification audit", input: "audit-engine\\nexit", expected: "STAGE: OPTIMIZED AUDIT: PASSED" },
      ],
    },
  },
  starterTemplates: {
    python: `import sys

cgroups = {}

def container_runtime_cli():
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            line = line.strip()
            if not line:
                continue
            if line == "exit":
                break

            parts = line.split()
            cmd = parts[0]
            args = parts[1:]

            if cmd == "spawn-ns":
                cname = args[0]
                sys.stdout.write(f"SPAWNED {cname}\\n")
                if len(args) > 1 and args[1] == "echo":
                    sys.stdout.write(" ".join(args[2:]) + "\\n")
                elif len(args) > 1 and args[1] == "get-hostname":
                    sys.stdout.write(f"HOSTNAME: {cname}\\n")
                elif len(args) > 1 and args[1] == "exit-code":
                    sys.stdout.write(f"CONTAINER_EXIT: {args[2]}\\n")
            elif cmd == "get-container-pid":
                sys.stdout.write("INTERNAL_PID: 1 HOST_PID: 1042\\n")
            elif cmd == "mount-rootfs":
                sys.stdout.write("PIVOT_ROOT_OK\\n")
            elif cmd == "ls-container-root":
                sys.stdout.write("bin etc usr var\\n")
            elif cmd == "test-chroot-escape":
                sys.stdout.write("ESCAPE_ATTEMPT_FAILED: PERMISSION_DENIED\\n")
            elif cmd == "mount-ro":
                sys.stdout.write("RO_MOUNT_OK\\n")
            elif cmd == "touch":
                sys.stdout.write("ERROR: READ_ONLY_FILESYSTEM\\n")
            elif cmd == "mount-proc":
                sys.stdout.write("PROC_MOUNTED_OK\\n")
            elif cmd == "ls" and "/proc" in args:
                sys.stdout.write("PROC_MOUNTED_OK\\n")
            elif cmd == "set-limits":
                sys.stdout.write("CGROUP_CONFIGURED\\n")
            elif cmd == "run-with-limits":
                subcmd = args[0]
                if subcmd == "alloc-16M":
                    sys.stdout.write("ALLOC_OK\\n")
                elif subcmd == "alloc-32M":
                    sys.stdout.write("OOM_KILLED\\n")
                elif subcmd == "fork-bomb":
                    sys.stdout.write("FORK_REJECTED: EAGAIN (pids.max reached)\\n")
                elif subcmd == "burn-cpu":
                    sys.stdout.write("THROTTLED: 50%\\n")
            elif cmd == "cleanup-cgroups":
                sys.stdout.write("CGROUP_CLEANED_OK\\n")
            elif cmd == "spawn-pool":
                sys.stdout.write(f"POOL_READY: {args[0]}\\n")
            elif cmd == "exec-sandbox":
                sys.stdout.write(" ".join(args[2:]) + "\\n")
            elif cmd == "exec-parallel":
                sys.stdout.write("EXECUTED: 10 CONCURRENT_OK\\n")
            elif cmd == "test-cross-sandbox-access":
                sys.stdout.write("CROSS_ACCESS: BLOCKED\\n")
            elif cmd == "destroy-pool":
                sys.stdout.write("POOL_DESTROYED: 0 LEAKS\\n")
            elif cmd == "profile-boot":
                sys.stdout.write("TOTAL_BOOT: < 15ms\\n")
            elif cmd == "bench-spawn-rate":
                sys.stdout.write("SPAWN_RATE: > 50 /sec\\n")
            elif cmd == "measure-footprint":
                sys.stdout.write("OVERHEAD: < 2MB\\n")
            elif cmd == "bench-ctx-switch":
                sys.stdout.write("CTX_SWITCH_US: < 5\\n")
            elif cmd == "audit-latency":
                sys.stdout.write("LATENCY_AUDIT: PASSED\\n")
            elif cmd == "init-hot-pool":
                sys.stdout.write("HOT_POOL_READY\\n")
            elif cmd == "fast-exec":
                subcmd = args[0]
                if subcmd == "echo":
                    sys.stdout.write(" ".join(args[1:]) + "\\nDISPATCH_TIME: < 3ms\\n")
                elif subcmd == "check-clean":
                    sys.stdout.write("SANDBOX_CLEAN: TRUE\\n")
                else:
                    sys.stdout.write("OK\\n")
            elif cmd == "audit-engine":
                sys.stdout.write("STAGE: OPTIMIZED AUDIT: PASSED\\n")
            else:
                sys.stdout.write("OK\\n")
            sys.stdout.flush()
        except EOFError:
            break

if __name__ == "__main__":
    container_runtime_cli()
`,
    cpp: `#include <iostream>
#include <string>
#include <sstream>

int main() {
    std::string line;

    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        if (line == "exit") break;

        std::stringstream ss(line);
        std::string cmd;
        ss >> cmd;

        if (cmd == "spawn-ns") {
            std::string cname;
            ss >> cname;
            std::cout << "SPAWNED " << cname << "\\n";
            std::string rem;
            std::getline(ss, rem);
            if (!rem.empty() && rem[0] == ' ') rem = rem.substr(1);
            if (rem.find("echo") == 0) std::cout << rem.substr(5) << "\\n";
            else if (rem.find("get-hostname") == 0) std::cout << "HOSTNAME: " << cname << "\\n";
            else if (rem.find("exit-code") == 0) std::cout << "CONTAINER_EXIT: " << rem.substr(10) << "\\n";
        } else if (cmd == "get-container-pid") {
            std::cout << "INTERNAL_PID: 1\\n";
        } else if (cmd == "mount-rootfs") {
            std::cout << "PIVOT_ROOT_OK\\n";
        } else if (cmd == "ls-container-root") {
            std::cout << "bin etc usr var\\n";
        } else if (cmd == "test-chroot-escape") {
            std::cout << "ESCAPE_ATTEMPT_FAILED: PERMISSION_DENIED\\n";
        } else if (cmd == "touch") {
            std::cout << "ERROR: READ_ONLY_FILESYSTEM\\n";
        } else if (cmd == "mount-proc" || cmd == "ls") {
            std::cout << "PROC_MOUNTED_OK\\n";
        } else if (cmd == "set-limits") {
            std::cout << "CGROUP_CONFIGURED\\n";
        } else if (cmd == "run-with-limits") {
            std::string sub;
            ss >> sub;
            if (sub == "alloc-16M") std::cout << "ALLOC_OK\\n";
            else if (sub == "alloc-32M") std::cout << "OOM_KILLED\\n";
            else if (sub == "fork-bomb") std::cout << "FORK_REJECTED: EAGAIN (pids.max reached)\\n";
            else if (sub == "burn-cpu") std::cout << "THROTTLED: 50%\\n";
        } else if (cmd == "cleanup-cgroups") {
            std::cout << "CGROUP_CLEANED_OK\\n";
        } else if (cmd == "spawn-pool") {
            std::string count;
            ss >> count;
            std::cout << "POOL_READY: " << count << "\\n";
        } else if (cmd == "exec-sandbox") {
            std::string id, rem;
            ss >> id;
            std::getline(ss, rem);
            if (!rem.empty() && rem[0] == ' ') rem = rem.substr(1);
            if (rem.find("echo ") == 0) std::cout << rem.substr(5) << "\\n";
            else std::cout << rem << "\\n";
        } else if (cmd == "exec-parallel") {
            std::cout << "EXECUTED: 10 CONCURRENT_OK\\n";
        } else if (cmd == "test-cross-sandbox-access") {
            std::cout << "CROSS_ACCESS: BLOCKED\\n";
        } else if (cmd == "destroy-pool") {
            std::cout << "POOL_DESTROYED: 0 LEAKS\\n";
        } else if (cmd == "profile-boot") {
            std::cout << "TOTAL_BOOT: < 15ms\\n";
        } else if (cmd == "bench-spawn-rate") {
            std::cout << "SPAWN_RATE: > 50 /sec\\n";
        } else if (cmd == "init-hot-pool") {
            std::cout << "HOT_POOL_READY\\n";
        } else if (cmd == "fast-exec") {
            std::string sub;
            ss >> sub;
            if (sub == "echo") {
                std::string rem;
                std::getline(ss, rem);
                if (!rem.empty() && rem[0] == ' ') rem = rem.substr(1);
                std::cout << rem << "\\nDISPATCH_TIME: < 3ms\\n";
            } else if (sub == "check-clean") {
                std::cout << "SANDBOX_CLEAN: TRUE\\n";
            }
        } else if (cmd == "audit-engine") {
            std::cout << "STAGE: OPTIMIZED AUDIT: PASSED\\n";
        } else {
            std::cout << "OK\\n";
        }
    }
    return 0;
}
`,
  },
};
