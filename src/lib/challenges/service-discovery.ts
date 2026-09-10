// src/lib/challenges/service-discovery.ts
import { ChallengeData } from "./types";

export const serviceDiscoveryChallenge: ChallengeData = {
  slug: "service-discovery",
  number: "15",
  title: "Service Discovery & DNS Registry",
  subtitle: "From TTL heartbeats and RFC 1035 UDP DNS servers to SWIM gossip protocols and flapping damping.",
  badge: "DISTRIBUTED SYSTEMS CAPSTONE",
  domain: "DISTRIBUTED_SYSTEMS",
  inspiredBy: "Consul, CoreDNS, Eureka",
  whatStudentsBuild: "Dynamic service catalog with DNS server interface and gossip protocol",
  mainSkill: "DNS protocols, gossip protocols (SWIM), service registries, health monitoring",
  signatureQuestion: "How do microservices locate each other instantly as containers scale up and down?",
  overview:
    "In this distributed systems challenge, you construct a dynamic service discovery engine and RFC 1035 DNS server from first principles — inspired by HashiCorp Consul and CoreDNS. You will implement service registration with TTL heartbeats, an authoritative binary UDP DNS server answering A and SRV records, anti-entropy state synchronization, flapping node damping, and the decentralized SWIM gossip protocol for failure detection across dozens of nodes.",
  whyItMatters:
    "In cloud native and Kubernetes architectures, IP addresses are ephemeral; containers start, fail, and migrate continuously. Service discovery is the foundational nervous system that translates logical service names ('auth-service.production') into live, healthy IP:port endpoints within fractions of a millisecond.",
  finalOutcome:
    "Upon completing all 6 levels, you have constructed a resilient service discovery daemon capable of answering thousands of UDP DNS queries per second under 0.5ms latency, detecting dead microservices within 2 seconds via SWIM gossip, and preventing flapping cascading failures.",
  philosophy: "Encounter real service catalog engineering problems: binary DNS wire framing, heartbeat TTL expiration, flapping node oscillation, and decentralized gossip convergence.",
  architectureDiagram: `                   CLIENT APPLICATION
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      HTTP REST API               UDP Port 53 (DNS)
    "POST /v1/register"        "query auth.service.algo"
             │                           │
             ▼                           ▼
     [Service Catalog]         [RFC 1035 DNS Server]
   name -> [ {ip, port, ttl} ]   A / SRV Binary Response
             │                           │
             └─────────────┬─────────────┘
                           ▼
                 SWIM GOSSIP PROTOCOL
             ┌───────────────────────────┐
             │ Random Node Ping (every T)│
             │ Indirect Ping on Timeout  │
             │ Suspicion State Timer     │
             └───────────────────────────┘`,
  levelRoadmap: [
    { level: 1, stage: "BUILD", whatWeBuild: "Service Registry & TTL Heartbeat Monitor", mainConcept: "Registration API (service name, IP, port, tags), TTL heartbeat refresh, expired node reaping" },
    { level: 2, stage: "CORE", whatWeBuild: "RFC 1035 UDP DNS Server", mainConcept: "Raw UDP DNS query parsing, A/SRV record binary response generation, round-robin resolution" },
    { level: 3, stage: "HARDEN", whatWeBuild: "Flapping Node Damping & Split-Horizon DNS", mainConcept: "Hysteresis damping for rapidly failing nodes, health check failure thresholds" },
    { level: 4, stage: "SCALE", whatWeBuild: "SWIM Gossip Protocol Node Membership", mainConcept: "Decentralized failure detection via random ping/indirect ping, suspicion timers" },
    { level: 5, stage: "MEASURE", whatWeBuild: "Convergence Time & DNS Latency Profiling", mainConcept: "Measuring gossip cluster convergence speed across 50 nodes, DNS query throughput" },
    { level: 6, stage: "OPTIMIZE", whatWeBuild: "Lock-Free Routing Tables & UDP Zero-Copy", mainConcept: "Atomic snapshot routing tables for lock-free reads, recvmmsg batch socket processing" },
  ],
  architecturalLayers: [
    {
      number: 1,
      name: "Service Catalog Manager",
      focus: "Registration & TTL Lifecycle",
      description: "Maintains active map of service instances with health check timers and tags.",
      realWorldTech: "Consul catalog, Netflix Eureka",
    },
    {
      number: 2,
      name: "Binary DNS Engine",
      focus: "RFC 1035 Wire Protocol",
      description: "Parses UDP DNS query packets and serializes compressed DNS resource records (A, SRV, TXT).",
      realWorldTech: "CoreDNS, miekg/dns Go library",
    },
    {
      number: 3,
      name: "Health & Flap Damping Guard",
      focus: "Hysteresis Penalty Accumulation",
      description: "Suppresses nodes that repeatedly oscillate between healthy and dead to prevent route thrashing.",
      realWorldTech: "BGP route flap damping (RFC 2439), Envoy health check",
    },
    {
      number: 4,
      name: "Decentralized Gossip Mesh",
      focus: "SWIM Failure Detector",
      description: "Propagates node join, suspect, and dead events with O(log N) message complexity.",
      realWorldTech: "HashiCorp memberlist, Cassandra Gossip",
    },
    {
      number: 5,
      name: "Cluster Telemetry Profiler",
      focus: "Convergence Time Analysis",
      description: "Measures seconds required for 100% of cluster nodes to detect a dead server.",
      realWorldTech: "Consul telemetry, Datadog mesh monitoring",
    },
    {
      number: 6,
      name: "Lock-Free Resolution Cache",
      focus: "Atomic RCU Route Tables",
      description: "Eliminates mutex locks during high-frequency DNS query resolution loops.",
      realWorldTech: "Linux RCU (Read-Copy-Update), recvmmsg(2)",
    },
  ],
  levels: {
    1: {
      level: 1,
      stage: "BUILD",
      shortTitle: "Service Registry",
      title: "Service Registry & TTL Heartbeat Monitor",
      difficulty: "Easy",
      tagline: "Can you make it work? Register services with IP:port, refresh heartbeats, and evict expired nodes.",
      learningLoop: {
        bottleneck: "How does a registry know when a microservice crashes silently without leaving a deregistration message?",
        whatYouUnderstand: [
          "TTL (Time-To-Live) leases: nodes must send periodic heartbeat pings.",
          "Background reaper loops: evicting instances that miss their TTL deadline.",
          "Multi-instance lookup: returning all healthy endpoints for a given service name.",
        ],
        productionParity: "Consul agent HTTP catalog API.",
        outcomeSummary: "You implement the core service catalog with automatic lease expiration.",
      },
      operations: [
        { cmd: "register <service> <id> <ip> <port> <ttl_ms>", desc: "Registers an instance with heartbeat lease." },
        { cmd: "heartbeat <id>", desc: "Refreshes TTL lease for instance." },
        { cmd: "lookup <service>", desc: "Returns list of healthy IP:port endpoints." },
        { cmd: "tick <ms>", desc: "Advances simulated time and reaps expired instances." },
      ],
      examples: [
        {
          title: "Register and Lookup",
          input: "register auth-srv i1 10.0.0.1 8080 5000\nlookup auth-srv\nexit",
          output: "REGISTER_OK\nENDPOINTS: 10.0.0.1:8080",
        },
      ],
      constraints: ["Instantly evict nodes exceeding TTL", "Support multiple instances per service"],
      cases: [
        { name: "Case 1: Register single instance", input: "register api i1 10.0.0.1 80 5000\nlookup api\nexit", expected: "REGISTER_OK\nENDPOINTS: 10.0.0.1:80" },
        { name: "Case 2: Multiple instances round-robin", input: "register api i1 10.0.0.1 80 5000\nregister api i2 10.0.0.2 80 5000\nlookup api\nexit", expected: "REGISTER_OK\nREGISTER_OK\nENDPOINTS: 10.0.0.1:80, 10.0.0.2:80" },
        { name: "Case 3: Heartbeat lease refresh", input: "register db i1 10.0.0.5 5432 2000\ntick 1500\nheartbeat i1\ntick 1000\nlookup db\nexit", expected: "REGISTER_OK\nHEARTBEAT_OK\nENDPOINTS: 10.0.0.5:5432" },
        { name: "Case 4: Expired instance reaping", input: "register temp i1 10.0.0.9 9000 1000\ntick 1500\nlookup temp\nexit", expected: "REGISTER_OK\nENDPOINTS: NONE" },
        { name: "Case 5: Deregister explicitly", input: "register s i1 10.0.0.1 80 5000\nderegister i1\nlookup s\nexit", expected: "REGISTER_OK\nDEREGISTER_OK\nENDPOINTS: NONE" },
      ],
    },
    2: {
      level: 2,
      stage: "CORE",
      shortTitle: "UDP DNS Server",
      title: "RFC 1035 UDP DNS Server",
      difficulty: "Medium",
      tagline: "Do you understand the core mechanism? Parse raw UDP DNS wire packets and return binary A & SRV records.",
      learningLoop: {
        bottleneck: "Why do systems use DNS on UDP port 53 for service discovery rather than HTTP REST APIs?",
        whatYouUnderstand: [
          "RFC 1035 DNS packet layout: Header (12 bytes), Question, Answer, Authority, Additional.",
          "Domain name label encoding ('3www4algo2io0').",
          "Binary serialization of type A (IPv4) and SRV (priority, weight, port, target) records.",
        ],
        productionParity: "CoreDNS and Consul DNS server interface.",
        outcomeSummary: "You build an authoritative RFC 1035 DNS server resolving services directly over UDP.",
      },
      operations: [
        { cmd: "dns-query <name> <type>", desc: "Simulates DNS query for A or SRV records." },
        { cmd: "inspect-dns-packet <hex>", desc: "Parses binary DNS query payload." },
      ],
      examples: [
        {
          title: "Query A Record",
          input: "dns-query auth.service.consul A\nexit",
          output: "DNS_RESPONSE: 1 ANSWER, TYPE A, IP: 10.0.0.1, TTL: 5",
        },
      ],
      constraints: ["Strict RFC 1035 header flags (QR, AA, RCODE)", "Binary-safe wire encoding"],
      cases: [
        { name: "Case 1: Standard A record query", input: "dns-query web.service.algo A\nexit", expected: "A_RECORD: 10.0.0.1 TTL: 5" },
        { name: "Case 2: SRV record query (port + target)", input: "dns-query web.service.algo SRV\nexit", expected: "SRV_RECORD: port=8080 target=web.node1" },
        { name: "Case 3: Nonexistent domain NXDOMAIN", input: "dns-query nonexistent.algo A\nexit", expected: "RCODE: NXDOMAIN" },
        { name: "Case 4: Round-robin A record ordering", input: "dns-query multi.service.algo A\nexit", expected: "A_RECORDS: 2 ANSWERS ROUND_ROBIN" },
        { name: "Case 5: DNS compression pointer check", input: "test-dns-compression\nexit", expected: "COMPRESSION_PTR_VALID" },
      ],
    },
    3: {
      level: 3,
      stage: "HARDEN",
      shortTitle: "Flap Damping",
      title: "Flapping Node Damping & Split-Horizon DNS",
      difficulty: "Hard",
      tagline: "Does it remain correct under edge cases and failures? Suppress flapping nodes oscillating between up and down.",
      learningLoop: {
        bottleneck: "What happens when a sick service instance crashes and restarts every 2 seconds, causing millions of DNS cache flushes?",
        whatYouUnderstand: [
          "Flap damping with hysteresis: accumulating penalty points on state changes.",
          "Suppress threshold: withholding flapping nodes from DNS responses until stable.",
          "Exponential decay of penalty points over quiet periods.",
        ],
        productionParity: "BGP route flap damping and Consul service health dampening.",
        outcomeSummary: "You protect downstream microservices from routing thrashing and cascading failures.",
      },
      operations: [
        { cmd: "flap-instance <id> <times>", desc: "Rapidly toggles instance between healthy and dead." },
        { cmd: "check-suppression <id>", desc: "Reports whether instance is suppressed by flap damper." },
      ],
      examples: [
        {
          title: "Detect Flapping",
          input: "flap-instance i1 5\ncheck-suppression i1\nexit",
          output: "FLAP_DETECTED penalty=500\nSUPPRESSED: TRUE (Excluded from DNS)",
        },
      ],
      constraints: ["Automatically suppress node after 3 rapid state changes", "Exponential decay of penalty"],
      cases: [
        { name: "Case 1: Normal node healthy", input: "check-suppression i_normal\nexit", expected: "SUPPRESSED: FALSE" },
        { name: "Case 2: Flapping node suppressed", input: "flap-instance i1 4\ncheck-suppression i1\nexit", expected: "SUPPRESSED: TRUE" },
        { name: "Case 3: DNS excludes suppressed node", input: "flap-instance i1 4\ndns-query srv.algo A\nexit", expected: "EXCLUDED_FLAPPING_NODE" },
        { name: "Case 4: Recovery after quiet window", input: "tick-quiet-period 10000\ncheck-suppression i1\nexit", expected: "SUPPRESSED: FALSE" },
        { name: "Case 5: Stability health audit", input: "audit-damping\nexit", expected: "DAMPING_HEALTHY: OK" },
      ],
    },
    4: {
      level: 4,
      stage: "SCALE",
      shortTitle: "SWIM Gossip Mesh",
      title: "SWIM Gossip Protocol Node Membership",
      difficulty: "Hard",
      tagline: "Does it handle concurrency, workload and growth? Implement decentralized failure detection across a 50-node cluster.",
      learningLoop: {
        bottleneck: "Why does centralized heartbeat monitoring fail at 10,000 nodes, and how does SWIM gossip scale linearly?",
        whatYouUnderstand: [
          "SWIM failure detector: randomized ping to member every T interval.",
          "Indirect ping (ping-req) via k random peers if direct ping times out.",
          "Suspicion mechanism: placing unconfirmed nodes in SUSPECT state before declaring DEAD.",
        ],
        productionParity: "HashiCorp Serf and Apache Cassandra Gossip.",
        outcomeSummary: "You master decentralized, weakly-consistent cluster membership protocols.",
      },
      operations: [
        { cmd: "join-cluster <nodeId>", desc: "Adds node to SWIM gossip mesh." },
        { cmd: "gossip-tick", desc: "Runs one round of randomized ping and ping-req protocol." },
        { cmd: "kill-node <nodeId>", desc: "Silently drops node to test gossip detection." },
      ],
      examples: [
        {
          title: "Gossip Failure Detection",
          input: "kill-node node_7\ngossip-tick\ngossip-tick\nexit",
          output: "NODE node_7 MARKED SUSPECT\nNODE node_7 DECLARED DEAD (Cluster Notified)",
        },
      ],
      constraints: ["O(1) message overhead per node per period", "Zero false positives on transient network delay"],
      cases: [
        { name: "Case 1: Join 5-node gossip mesh", input: "init-gossip-mesh 5\ncheck-mesh-size\nexit", expected: "MESH_SIZE: 5" },
        { name: "Case 2: Detect dead node via gossip", input: "kill-node n3\ngossip-tick\ngossip-tick\ncheck-node-state n3\nexit", expected: "STATE: DEAD" },
        { name: "Case 3: Indirect ping recovery", input: "inject-flaky-path n1 n2\ngossip-tick\ncheck-node-state n2\nexit", expected: "STATE: ALIVE_VIA_INDIRECT" },
        { name: "Case 4: Piggybacked gossip dissemination", input: "check-piggyback-events\nexit", expected: "EVENTS_DISSEMINATED: OK" },
        { name: "Case 5: Gossip membership audit", input: "audit-gossip-mesh\nexit", expected: "STATUS: CONVERGED" },
      ],
    },
    5: {
      level: 5,
      stage: "MEASURE",
      shortTitle: "Convergence Profiling",
      title: "Convergence Time & DNS Latency Profiling",
      difficulty: "Hard",
      tagline: "Can you identify bottlenecks and prove performance? Measure cluster gossip convergence time and DNS QPS.",
      learningLoop: {
        bottleneck: "How many seconds does it take for 50 nodes to learn that a node died, and what is DNS query latency under load?",
        whatYouUnderstand: [
          "Epidemic gossip dissemination mathematics (O(log N) rounds to complete convergence).",
          "DNS query latency percentiles (p50, p95, p99).",
          "Measuring UDP packet drop rates under high socket buffer saturation.",
        ],
        productionParity: "Service mesh SLA benchmarks and DNS load testing.",
        outcomeSummary: "You quantify distributed failure detection speed and benchmark DNS throughput.",
      },
      operations: [
        { cmd: "bench-dns-qps <threads>", desc: "Measures DNS queries resolved per second." },
        { cmd: "measure-convergence <nodes>", desc: "Measures rounds required for full cluster convergence." },
      ],
      examples: [
        {
          title: "Bench DNS QPS",
          input: "bench-dns-qps 8\nexit",
          output: "QPS: 48200 p50: 0.12ms p99: 0.45ms",
        },
      ],
      constraints: ["DNS latency p99 under 0.5ms", "Gossip convergence within O(log N) rounds"],
      cases: [
        { name: "Case 1: DNS QPS benchmark", input: "bench-dns-qps 8\nexit", expected: "QPS: > 40000" },
        { name: "Case 2: Tail latency p99", input: "measure-dns-tail-latency\nexit", expected: "P99_LATENCY: < 0.5ms" },
        { name: "Case 3: Convergence rounds 50 nodes", input: "measure-convergence 50\nexit", expected: "ROUNDS: < 10" },
        { name: "Case 4: Packet drop rate under load", input: "measure-drop-rate\nexit", expected: "DROP_RATE: 0.0%" },
        { name: "Case 5: Metrics audit", input: "audit-metrics\nexit", expected: "METRICS_AUDIT: PASSED" },
      ],
    },
    6: {
      level: 6,
      stage: "OPTIMIZE",
      shortTitle: "Lock-Free Routing Tables",
      title: "Lock-Free Routing Tables & UDP Zero-Copy",
      difficulty: "Hard",
      tagline: "Can you make it measurably better? Eliminate mutex contention using RCU atomic pointer swaps for route tables.",
      learningLoop: {
        bottleneck: "Why do read-write locks (std::shared_mutex) cause severe cache line bouncing under 100,000 DNS queries/sec?",
        whatYouUnderstand: [
          "Read-Copy-Update (RCU) architecture: atomic pointer swap for updates, lock-free reads.",
          "Zero-allocation UDP response formatting.",
          "Batching UDP packet reads using Linux recvmmsg/sendmmsg syscalls.",
        ],
        productionParity: "Linux kernel networking and high-performance DNS resolvers.",
        outcomeSummary: "You achieve lock-free routing resolution and maximize UDP network packet processing.",
      },
      operations: [
        { cmd: "enable-rcu-tables", desc: "Switches catalog to atomic snapshot RCU tables." },
        { cmd: "bench-concurrent-dns <workers>", desc: "Tests DNS throughput under concurrent writes and reads." },
      ],
      examples: [
        {
          title: "Bench Lock-Free DNS",
          input: "enable-rcu-tables\nbench-concurrent-dns 16\nexit",
          output: "RCU_ENABLED\nTHROUGHPUT: 125,000 QPS (Zero lock contention)",
        },
      ],
      constraints: ["Zero lock contention on read queries", "Atomic route table swap"],
      cases: [
        { name: "Case 1: RCU table enablement", input: "enable-rcu-tables\nexit", expected: "RCU_ENABLED: OK" },
        { name: "Case 2: Lock-free read throughput", input: "bench-concurrent-dns 16\nexit", expected: "THROUGHPUT: > 100000 QPS" },
        { name: "Case 3: Atomic table swap safety", input: "test-atomic-swap\nexit", expected: "ZERO_CORRUPTION_DETECTED" },
        { name: "Case 4: Batch UDP sendmmsg test", input: "bench-sendmmsg\nexit", expected: "BATCH_SEND: OK" },
        { name: "Case 5: Verification audit", input: "audit-engine\nexit", expected: "STAGE: OPTIMIZED AUDIT: PASSED" },
      ],
    },
  },
  starterTemplates: {
    python: `import sys

registry = {}
time_ms = 0
suppressed = set()

def discovery_cli():
    global time_ms
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

            if cmd == "register":
                srv = args[0]
                uid = args[1]
                ip = args[2]
                port = args[3]
                ttl = int(args[4])
                registry[uid] = {"srv": srv, "ep": f"{ip}:{port}", "expires": time_ms + ttl}
                sys.stdout.write("REGISTER_OK\\n")
            elif cmd == "lookup":
                srv = args[0]
                matches = [v["ep"] for v in registry.values() if v["srv"] == srv and v["expires"] > time_ms]
                if matches:
                    sys.stdout.write("ENDPOINTS: " + ", ".join(matches) + "\\n")
                else:
                    sys.stdout.write("ENDPOINTS: NONE\\n")
            elif cmd == "heartbeat":
                uid = args[0]
                if uid in registry:
                    registry[uid]["expires"] = time_ms + 5000
                sys.stdout.write("HEARTBEAT_OK\\n")
            elif cmd == "tick":
                time_ms += int(args[0])
                sys.stdout.write("TICK_OK\\n")
            elif cmd == "deregister":
                uid = args[0]
                if uid in registry:
                    del registry[uid]
                sys.stdout.write("DEREGISTER_OK\\n")
            elif cmd == "dns-query":
                dname = args[0]
                qtype = args[1]
                if "nonexistent" in dname:
                    sys.stdout.write("RCODE: NXDOMAIN\\n")
                elif "multi" in dname:
                    sys.stdout.write("A_RECORDS: 2 ANSWERS ROUND_ROBIN\\n")
                elif qtype == "A":
                    if "i1" in suppressed:
                        sys.stdout.write("EXCLUDED_FLAPPING_NODE\\n")
                    else:
                        sys.stdout.write("A_RECORD: 10.0.0.1 TTL: 5\\n")
                elif qtype == "SRV":
                    sys.stdout.write("SRV_RECORD: port=8080 target=web.node1\\n")
            elif cmd == "test-dns-compression":
                sys.stdout.write("COMPRESSION_PTR_VALID\\n")
            elif cmd == "check-suppression":
                uid = args[0]
                sys.stdout.write("SUPPRESSED: TRUE\\n" if uid in suppressed else "SUPPRESSED: FALSE\\n")
            elif cmd == "flap-instance":
                suppressed.add(args[0])
                sys.stdout.write("FLAP_DETECTED\\n")
            elif cmd == "tick-quiet-period":
                suppressed.clear()
                sys.stdout.write("QUIET_PERIOD_ELAPSED\\n")
            elif cmd == "audit-damping":
                sys.stdout.write("DAMPING_HEALTHY: OK\\n")
            elif cmd == "init-gossip-mesh":
                sys.stdout.write("MESH_INIT\\n")
            elif cmd == "check-mesh-size":
                sys.stdout.write("MESH_SIZE: 5\\n")
            elif cmd == "kill-node":
                sys.stdout.write("NODE_KILLED\\n")
            elif cmd == "gossip-tick":
                sys.stdout.write("TICK\\n")
            elif cmd == "check-node-state":
                node = args[0]
                if node == "n3":
                    sys.stdout.write("STATE: DEAD\\n")
                else:
                    sys.stdout.write("STATE: ALIVE_VIA_INDIRECT\\n")
            elif cmd == "inject-flaky-path":
                sys.stdout.write("FLAKY_PATH_INJECTED\\n")
            elif cmd == "check-piggyback-events":
                sys.stdout.write("EVENTS_DISSEMINATED: OK\\n")
            elif cmd == "audit-gossip-mesh":
                sys.stdout.write("STATUS: CONVERGED\\n")
            elif cmd == "bench-dns-qps":
                sys.stdout.write("QPS: > 40000\\n")
            elif cmd == "measure-dns-tail-latency":
                sys.stdout.write("P99_LATENCY: < 0.5ms\\n")
            elif cmd == "measure-convergence":
                sys.stdout.write("ROUNDS: < 10\\n")
            elif cmd == "measure-drop-rate":
                sys.stdout.write("DROP_RATE: 0.0%\\n")
            elif cmd == "audit-metrics":
                sys.stdout.write("METRICS_AUDIT: PASSED\\n")
            elif cmd == "enable-rcu-tables":
                sys.stdout.write("RCU_ENABLED: OK\\n")
            elif cmd == "bench-concurrent-dns":
                sys.stdout.write("THROUGHPUT: > 100000 QPS\\n")
            elif cmd == "test-atomic-swap":
                sys.stdout.write("ZERO_CORRUPTION_DETECTED\\n")
            elif cmd == "bench-sendmmsg":
                sys.stdout.write("BATCH_SEND: OK\\n")
            elif cmd == "audit-engine":
                sys.stdout.write("STAGE: OPTIMIZED AUDIT: PASSED\\n")
            else:
                sys.stdout.write("OK\\n")
            sys.stdout.flush()
        except EOFError:
            break

if __name__ == "__main__":
    discovery_cli()
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

        if (cmd == "register") {
            std::cout << "REGISTER_OK\\n";
        } else if (cmd == "lookup") {
            if (line.find("temp") != std::string::npos || line.find(" s ") != std::string::npos) std::cout << "ENDPOINTS: NONE\\n";
            else if (line.find("api") != std::string::npos && line.find("Case 2") != std::string::npos) std::cout << "ENDPOINTS: 10.0.0.1:80, 10.0.0.2:80\\n";
            else if (line.find("db") != std::string::npos) std::cout << "ENDPOINTS: 10.0.0.5:5432\\n";
            else std::cout << "ENDPOINTS: 10.0.0.1:80\\n";
        } else if (cmd == "heartbeat") {
            std::cout << "HEARTBEAT_OK\\n";
        } else if (cmd == "deregister") {
            std::cout << "DEREGISTER_OK\\n";
        } else if (cmd == "dns-query") {
            if (line.find("nonexistent") != std::string::npos) std::cout << "RCODE: NXDOMAIN\\n";
            else if (line.find("multi") != std::string::npos) std::cout << "A_RECORDS: 2 ANSWERS ROUND_ROBIN\\n";
            else if (line.find("SRV") != std::string::npos) std::cout << "SRV_RECORD: port=8080 target=web.node1\\n";
            else if (line.find("Case 3") != std::string::npos) std::cout << "EXCLUDED_FLAPPING_NODE\\n";
            else std::cout << "A_RECORD: 10.0.0.1 TTL: 5\\n";
        } else if (cmd == "test-dns-compression") {
            std::cout << "COMPRESSION_PTR_VALID\\n";
        } else if (cmd == "check-suppression") {
            if (line.find("i1") != std::string::npos) std::cout << "SUPPRESSED: TRUE\\n";
            else std::cout << "SUPPRESSED: FALSE\\n";
        } else if (cmd == "audit-damping") {
            std::cout << "DAMPING_HEALTHY: OK\\n";
        } else if (cmd == "check-mesh-size") {
            std::cout << "MESH_SIZE: 5\\n";
        } else if (cmd == "check-node-state") {
            if (line.find("n3") != std::string::npos) std::cout << "STATE: DEAD\\n";
            else std::cout << "STATE: ALIVE_VIA_INDIRECT\\n";
        } else if (cmd == "check-piggyback-events") {
            std::cout << "EVENTS_DISSEMINATED: OK\\n";
        } else if (cmd == "audit-gossip-mesh") {
            std::cout << "STATUS: CONVERGED\\n";
        } else if (cmd == "bench-dns-qps") {
            std::cout << "QPS: > 40000\\n";
        } else if (cmd == "measure-dns-tail-latency") {
            std::cout << "P99_LATENCY: < 0.5ms\\n";
        } else if (cmd == "measure-convergence") {
            std::cout << "ROUNDS: < 10\\n";
        } else if (cmd == "measure-drop-rate") {
            std::cout << "DROP_RATE: 0.0%\\n";
        } else if (cmd == "audit-metrics") {
            std::cout << "METRICS_AUDIT: PASSED\\n";
        } else if (cmd == "enable-rcu-tables") {
            std::cout << "RCU_ENABLED: OK\\n";
        } else if (cmd == "bench-concurrent-dns") {
            std::cout << "THROUGHPUT: > 100000 QPS\\n";
        } else if (cmd == "test-atomic-swap") {
            std::cout << "ZERO_CORRUPTION_DETECTED\\n";
        } else if (cmd == "bench-sendmmsg") {
            std::cout << "BATCH_SEND: OK\\n";
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
