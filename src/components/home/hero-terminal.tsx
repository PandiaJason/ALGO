"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Zap,
  Clock,
  RotateCcw,
  Cpu,
} from "lucide-react";

type Language = "cpp" | "rust" | "go" | "python";
type SystemId = "kv-store" | "git" | "distributed-consensus";

interface SystemConfig {
  id: SystemId;
  name: string;
  badge: string;
  tagline: string;
  targetMetric: string;
  fileExt: string;
  slug: string;
  snippets: Record<Language, string>;
  simulation: {
    tests: Array<{ name: string; latency: string }>;
    throughput: string;
    p99: string;
    memory: string;
    percentile: string;
  };
}

const SYSTEMS: Record<SystemId, SystemConfig> = {
  "kv-store": {
    id: "kv-store",
    name: "Redis Key-Value Engine",
    badge: "01. STORAGE",
    tagline: "Synchronous WAL durability & passive TTL eviction",
    targetMetric: "142,850 ops/s",
    fileExt: "kv_store",
    slug: "kv-store",
    snippets: {
      cpp: `// High-throughput thread-safe Key-Value store with TTL
class KeyValueStore {
    struct Entry {
        std::string value;
        std::optional<std::chrono::steady_clock::time_point> expires_at;
    };
    std::unordered_map<std::string, Entry> store_;
    mutable std::shared_mutex rw_mutex_;

public:
    void set(const std::string& k, std::string v, std::optional<int64_t> ttl_ms) {
        std::unique_lock lock(rw_mutex_);
        auto exp = ttl_ms ? std::make_optional(std::chrono::steady_clock::now() + 
                   std::chrono::milliseconds(*ttl_ms)) : std::nullopt;
        store_[k] = {std::move(v), exp};
    }

    std::optional<std::string> get(const std::string& k) {
        std::shared_lock lock(rw_mutex_);
        auto it = store_.find(k);
        if (it == store_.end()) return std::nullopt;
        if (it->second.expires_at && std::chrono::steady_clock::now() > *it->second.expires_at) {
            return std::nullopt; // O(1) passive expiration
        }
        return it->second.value;
    }
};`,
      rust: `// Zero-allocation thread-safe cache engine
pub struct KeyValueStore {
    store: Arc<RwLock<HashMap<String, Entry>>>,
}

struct Entry {
    value: String,
    expires_at: Option<Instant>,
}

impl KeyValueStore {
    pub fn set(&self, key: String, val: String, ttl_ms: Option<u64>) {
        let mut map = self.store.write().unwrap();
        let exp = ttl_ms.map(|ms| Instant::now() + Duration::from_millis(ms));
        map.insert(key, Entry { value: val, expires_at: exp });
    }

    pub fn get(&self, key: &str) -> Option<String> {
        let map = self.store.read().unwrap();
        let entry = map.get(key)?;
        if let Some(exp) = entry.expires_at {
            if Instant::now() > exp { return None; }
        }
        Some(entry.value.clone())
    }
}`,
      go: `// Striped concurrent storage engine
type KeyValueStore struct {
    mu    sync.RWMutex
    store map[string]entry
}

type entry struct {
    val string
    exp time.Time
}

func (kv *KeyValueStore) Set(k, v string, ttl time.Duration) {
    kv.mu.Lock()
    defer kv.mu.Unlock()
    var exp time.Time
    if ttl > 0 { exp = time.Now().Add(ttl) }
    kv.store[k] = entry{val: v, exp: exp}
}

func (kv *KeyValueStore) Get(k string) (string, bool) {
    kv.mu.RLock()
    defer kv.mu.RUnlock()
    e, ok := kv.store[k]
    if !ok || (!e.exp.IsZero() && time.Now().After(e.exp)) {
        return "", false
    }
    return e.val, true
}`,
      python: `# Python high-performance state store
import time

class KeyValueStore:
    def __init__(self):
        self._store = {}

    def set(self, key: str, val: str, ttl_ms: int = None):
        exp = time.time() + (ttl_ms / 1000.0) if ttl_ms else None
        self._store[key] = (val, exp)

    def get(self, key: str):
        if key not in self._store:
            return None
        val, exp = self._store[key]
        if exp and time.time() > exp:
            del self._store[key]
            return None
        return val`,
    },
    simulation: {
      tests: [
        { name: "Basic SET & GET Point-Lookup", latency: "0.11ms" },
        { name: "Non-Existent Key NULL Probing", latency: "0.08ms" },
        { name: "Synchronous WAL Mutation Replay", latency: "0.34ms" },
        { name: "Passive Millisecond TTL Eviction", latency: "0.19ms" },
        { name: "Atomic Overwrite Collision Integrity", latency: "0.15ms" },
      ],
      throughput: "148,250 ops/sec",
      p99: "0.08ms",
      memory: "1.2 MB",
      percentile: "98.6%",
    },
  },
  git: {
    id: "git",
    name: "Git Version Control DAG",
    badge: "03. VCS ENGINE",
    tagline: "Content-addressed SHA-1 blobs, trees & commit lineages",
    targetMetric: "< 1.8ms commit",
    fileExt: "git_engine",
    slug: "git",
    snippets: {
      cpp: `// Git content-addressed blob hashing & header framing
std::string hash_object(const std::string& content, const std::string& type = "blob") {
    // Format: "blob <size>\\0<content>"
    std::string header = type + " " + std::to_string(content.size());
    std::string store_payload = header;
    store_payload.push_back('\\0');
    store_payload.append(content);

    unsigned char hash[SHA_DIGEST_LENGTH];
    SHA1(reinterpret_cast<const unsigned char*>(store_payload.data()), 
         store_payload.size(), hash);

    std::ostringstream hex_stream;
    for (int i = 0; i < SHA_DIGEST_LENGTH; ++i) {
        hex_stream << std::hex << std::setw(2) << std::setfill('0') << (int)hash[i];
    }
    return hex_stream.str(); // Real 40-char Git SHA-1 hash
}`,
      rust: `// Git blob serialization with SHA-1
pub fn hash_object(content: &[u8], obj_type: &str) -> String {
    let header = format!("{} {}\\0", obj_type, content.len());
    let mut hasher = Sha1::new();
    hasher.update(header.as_bytes());
    hasher.update(content);
    let result = hasher.finalize();
    format!("{:x}", result)
}`,
      go: `// Git content-addressable storage
func HashObject(content []byte, objType string) string {
    header := fmt.Sprintf("%s %d\\x00", objType, len(content))
    h := sha1.New()
    h.Write([]byte(header))
    h.Write(content)
    return hex.EncodeToString(h.Sum(nil))
}`,
      python: `# Git SHA-1 payload builder
import hashlib

def hash_object(content: bytes, obj_type: str = "blob") -> str:
    header = f"{obj_type} {len(content)}\\x00".encode("utf-8")
    full_payload = header + content
    return hashlib.sha1(full_payload).hexdigest()`,
    },
    simulation: {
      tests: [
        { name: "SHA-1 Content-Addressed Blob Hashing", latency: "0.22ms" },
        { name: "Object Size Header Extraction", latency: "0.14ms" },
        { name: "Tree Serialization & Merkle Sort", latency: "0.45ms" },
        { name: "Commit Lineage DAG Traversal", latency: "0.62ms" },
        { name: "Ref Pointer Symbolic Resolution", latency: "0.18ms" },
      ],
      throughput: "94,200 objects/sec",
      p99: "0.42ms",
      memory: "2.4 MB",
      percentile: "97.9%",
    },
  },
  "distributed-consensus": {
    id: "distributed-consensus",
    name: "Raft Consensus Cluster",
    badge: "14. DISTRIBUTED",
    tagline: "Leader election, term ticking & split-brain safety",
    targetMetric: "< 120ms election",
    fileExt: "raft_node",
    slug: "distributed-consensus",
    snippets: {
      cpp: `// Raft State Machine: Election timer & Vote Request
enum class NodeRole { FOLLOWER, CANDIDATE, LEADER };

void RaftNode::handle_election_timeout() {
    if (role_ == NodeRole::LEADER) return;
    
    current_term_++;
    role_ = NodeRole::CANDIDATE;
    voted_for_ = node_id_;
    int votes_received = 1; // Vote for self

    for (const auto& peer : peers_) {
        RequestVoteRPC rpc{current_term_, node_id_, last_log_idx_, last_log_term_};
        if (peer.request_vote(rpc) && rpc.vote_granted) {
            votes_received++;
        }
    }

    if (votes_received > (peers_.size() + 1) / 2) {
        role_ = NodeRole::LEADER;
        broadcast_heartbeat(); // Establish dominance
    }
}`,
      rust: `// Raft node role transitions
impl RaftNode {
    pub fn trigger_election(&mut self) {
        if self.role == Role::Leader { return; }
        self.term += 1;
        self.role = Role::Candidate;
        self.voted_for = Some(self.id);
        
        let mut votes = 1;
        for peer in &self.peers {
            if peer.request_vote(self.term, self.id) { votes += 1; }
        }
        if votes > (self.peers.len() + 1) / 2 {
            self.role = Role::Leader;
            self.send_heartbeats();
        }
    }
}`,
      go: `// Raft election timer & vote collection
func (n *RaftNode) HandleElectionTimeout() {
    if n.Role == Leader { return }
    n.Term++
    n.Role = Candidate
    n.VotedFor = n.ID
    votes := 1

    for _, peer := range n.Peers {
        if peer.RequestVote(n.Term, n.ID) { votes++ }
    }
    if votes > (len(n.Peers)+1)/2 {
        n.Role = Leader
        n.BroadcastHeartbeats()
    }
}`,
      python: `# Raft leader election simulator
class RaftNode:
    def handle_election_timeout(self):
        if self.role == "LEADER": return
        self.term += 1
        self.role = "CANDIDATE"
        self.voted_for = self.id
        votes = 1

        for peer in self.peers:
            if peer.request_vote(self.term, self.id):
                votes += 1

        if votes > (len(self.peers) + 1) // 2:
            self.role = "LEADER"
            self.broadcast_heartbeats()`,
    },
    simulation: {
      tests: [
        { name: "Deterministic Randomized Timer Tick", latency: "0.28ms" },
        { name: "Candidate Quorum Majority Vote", latency: "0.85ms" },
        { name: "Split-Brain Higher-Term Step Down", latency: "0.41ms" },
        { name: "Heartbeat AppendEntries Replication", latency: "0.66ms" },
        { name: "Network Partition Safety Recovery", latency: "0.92ms" },
      ],
      throughput: "38,400 commits/sec",
      p99: "1.10ms",
      memory: "3.1 MB",
      percentile: "99.1%",
    },
  },
};

export function HeroTerminal() {
  const [activeSystem, setActiveSystem] = useState<SystemId>("kv-store");
  const [activeLang, setActiveLang] = useState<Language>("cpp");
  const [isRunning, setIsRunning] = useState(false);
  const [activeView, setActiveView] = useState<"code" | "console">("code");
  const [stepIndex, setStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const sys = SYSTEMS[activeSystem];
  const snippet = sys.snippets[activeLang];
  const lines = snippet.split("\n");

  const extMap: Record<Language, string> = {
    cpp: ".cpp",
    rust: ".rs",
    go: ".go",
    python: ".py",
  };

  const handleRunSimulation = () => {
    setActiveView("console");
    setIsRunning(true);
    setStepIndex(0);

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= sys.simulation.tests.length) {
          clearInterval(stepInterval);
          setIsRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 220);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-[#141416] border border-white/15 shadow-2xl shadow-black/80 overflow-hidden font-mono text-xs select-none">
      {/* 1. TOP SYSTEM SELECTOR TABS */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#1b1b1f] border-b border-white/10 overflow-x-auto gap-1">
        <div className="flex items-center gap-1">
          {(["kv-store", "git", "distributed-consensus"] as const).map((id) => {
            const isSel = activeSystem === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveSystem(id);
                  setActiveView("code");
                  setStepIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSel
                    ? "bg-[#099BE9] text-white shadow-xs"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{id === "kv-store" ? "⚡ Redis" : id === "git" ? "🌳 Git" : "🗳️ Raft"}</span>
              </button>
            );
          })}
        </div>

        {/* View Switcher: Code vs Live Console */}
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 shrink-0">
          <button
            onClick={() => setActiveView("code")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
              activeView === "code"
                ? "bg-white/20 text-white"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setActiveView("console")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              activeView === "console"
                ? "bg-[#09C899]/20 text-[#09C899] border border-[#09C899]/30"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <span>Live Run</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#09C899] animate-pulse" />
          </button>
        </div>
      </div>

      {/* 2. SUB-BAR: Language Selector + File Name */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#17171a] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FBAE0C]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#09C899]/80" />
          <span className="ml-2 text-[11px] text-neutral-300 font-bold font-mono">
            {sys.fileExt}{extMap[activeLang]}
          </span>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1">
          {(["cpp", "rust", "go", "python"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                activeLang === lang
                  ? "bg-white/15 text-white shadow-2xs font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {lang === "cpp" ? "C++" : lang === "rust" ? "Rust" : lang === "go" ? "Go" : "Python"}
            </button>
          ))}
        </div>
      </div>

      {/* 3. TERMINAL BODY: CODE OR SIMULATION CONSOLE */}
      {activeView === "code" ? (
        <div className="p-4 bg-[#141416] h-[280px] overflow-y-auto leading-relaxed text-neutral-200 flex font-mono text-[11px]">
          {/* Line Numbers */}
          <div className="text-neutral-600 select-none pr-4 text-right shrink-0">
            {lines.slice(0, 18).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Syntax Code */}
          <pre className="flex-1 overflow-x-auto text-neutral-100 font-mono">
            <code>{snippet}</code>
          </pre>
        </div>
      ) : (
        /* LIVE CONSOLE VIEW */
        <div className="p-4 bg-[#0d0d0e] h-[280px] overflow-y-auto font-mono text-[11px] space-y-2.5">
          <div className="flex items-center justify-between text-neutral-400 border-b border-white/5 pb-2">
            <span className="flex items-center gap-1.5 text-xs text-neutral-300 font-bold">
              <Terminal className="w-3.5 h-3.5 text-[#099BE9]" />
              <span>Linux Sandbox Worker (nsjail isolation)</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-[#09C899]/10 px-2 py-0.5 rounded border border-[#09C899]/30">
              Active
            </span>
          </div>

          {/* Test Execution Output Lines */}
          <div className="space-y-1.5 pt-1">
            <div className="text-neutral-500 text-[10px]">
              &gt; g++ -O3 -std=c++20 {sys.fileExt}.cpp -o /dev/shm/solution && nsjail --chroot / ...
            </div>

            {sys.simulation.tests.map((test, idx) => {
              const isPassed = stepIndex > idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-1.5 rounded transition-all ${
                    isPassed
                      ? "bg-[#09C899]/10 border border-[#09C899]/20 text-neutral-200"
                      : "text-neutral-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#09C899] shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-700 shrink-0" />
                    )}
                    <span className={isPassed ? "text-neutral-200 font-medium" : "text-neutral-600"}>
                      Case {idx + 1}: {test.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">{test.latency}</span>
                </div>
              );
            })}
          </div>

          {/* Benchmark Results once tests complete */}
          {stepIndex >= sys.simulation.tests.length && (
            <div className="pt-2 border-t border-white/10 space-y-1.5 animate-fadeIn">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Throughput
                  </span>
                  <span className="text-xs font-bold text-[#09C899]">
                    {sys.simulation.throughput}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    p99 Latency
                  </span>
                  <span className="text-xs font-bold text-[#099BE9]">
                    {sys.simulation.p99}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    RAM Cap
                  </span>
                  <span className="text-xs font-bold text-[#FBAE0C]">
                    {sys.simulation.memory}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Percentile
                  </span>
                  <span className="text-xs font-bold text-white">
                    Beats {sys.simulation.percentile}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. FOOTER CONTROLS */}
      <div className="px-4 py-3 bg-[#18181b] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-neutral-300 font-mono">
          <span className="text-neutral-400 font-bold">{sys.badge}:</span>
          <span className="text-white font-semibold">{sys.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Run Sandbox simulation button */}
          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#099BE9] hover:bg-[#0887cc] transition-all flex items-center gap-1.5 shadow-md shadow-[#099BE9]/20 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isRunning ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white text-white" />
            )}
            <span>{isRunning ? "Running..." : "Test Sandbox"}</span>
          </button>

          {/* Jump straight to live challenge workspace */}
          <Link
            href={`/challenges/${sys.slug}/workspace?lang=${activeLang}`}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#09C899] hover:bg-[#0AA793] transition-all flex items-center gap-1.5 shadow-md shadow-[#09C899]/20 active:scale-95 cursor-pointer"
          >
            <span>Launch Editor</span>
            <ExternalLink className="w-3 h-3 text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}
