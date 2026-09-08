"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, CheckCircle2, Copy, Check, ExternalLink } from "lucide-react";

type Language = "cpp" | "rust" | "go" | "python" | "java";

interface CodeSnippet {
  code: string;
  langTag: string;
  fileExt: string;
}

const SNIPPETS: Record<Language, CodeSnippet> = {
  cpp: {
    langTag: "C++ 20",
    fileExt: "kv_store.cpp",
    code: `class KeyValueStore {
private:
    struct Entry {
        std::string value;
        std::optional<std::chrono::steady_clock::time_point> exp;
    };
    std::unordered_map<std::string, Entry> store_;
    mutable std::shared_mutex rw_mutex_;

public:
    void set(const std::string& key, std::string val, std::optional<int64_t> ttl_ms) {
        std::unique_lock lock(rw_mutex_);
        auto exp_tp = ttl_ms ? std::make_optional(std::chrono::steady_clock::now() + 
                      std::chrono::milliseconds(*ttl_ms)) : std::nullopt;
        store_[key] = {std::move(val), exp_tp};
    }

    std::optional<std::string> get(const std::string& key) {
        std::shared_lock lock(rw_mutex_);
        auto it = store_.find(key);
        if (it == store_.end()) return std::nullopt;
        if (it->second.exp && std::chrono::steady_clock::now() > *it->second.exp) {
            return std::nullopt; // Passive TTL eviction
        }
        return it->second.value;
    }
};`,
  },
  rust: {
    langTag: "Rust",
    fileExt: "kv_store.rs",
    code: `pub struct KeyValueStore {
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
            if Instant::now() > exp { return None; } // O(1) passive sweep
        }
        Some(entry.value.clone())
    }
}`,
  },
  go: {
    langTag: "Go",
    fileExt: "kv_store.go",
    code: `type KeyValueStore struct {
    mu    sync.RWMutex
    store map[string]entry
}

type entry struct {
    value     string
    expiresAt time.Time
}

func (kv *KeyValueStore) Set(key, val string, ttl time.Duration) {
    kv.mu.Lock()
    defer kv.mu.Unlock()
    var exp time.Time
    if ttl > 0 { exp = time.Now().Add(ttl) }
    kv.store[key] = entry{value: val, expiresAt: exp}
}

func (kv *KeyValueStore) Get(key string) (string, bool) {
    kv.mu.RLock()
    defer kv.mu.RUnlock()
    e, ok := kv.store[key]
    if !ok || (!e.expiresAt.IsZero() && time.Now().After(e.expiresAt)) {
        return "", false // TTL expired
    }
    return e.value, true
}`,
  },
  python: {
    langTag: "Python 3.12",
    fileExt: "kv_store.py",
    code: `class KeyValueStore:
    def __init__(self):
        self.store = {}          # O(1) Hash Map
        self._lock = threading.Lock()

    def set(self, key: str, value: str, ttl_ms: int = None) -> bool:
        expire_at = (time.monotonic() + ttl_ms/1000.0) if ttl_ms else None
        with self._lock:
            self.store[key] = (value, expire_at)
        return True

    def get(self, key: str) -> str | None:
        with self._lock:
            entry = self.store.get(key)
            if not entry:
                return None
            val, expire_at = entry
            if expire_at and time.monotonic() > expire_at:
                del self.store[key]  # Passive eviction
                return None
            return val`,
  },
  java: {
    langTag: "Java 21",
    fileExt: "KeyValueStore.java",
    code: `public class KeyValueStore {
    private final ConcurrentHashMap<String, Entry> store = new ConcurrentHashMap<>();

    private record Entry(String value, Long expiresAt) {}

    public void set(String key, String value, Long ttlMs) {
        Long exp = ttlMs != null ? System.currentTimeMillis() + ttlMs : null;
        store.put(key, new Entry(value, exp));
    }

    public String get(String key) {
        Entry e = store.get(key);
        if (e == null) return null;
        if (e.expiresAt() != null && System.currentTimeMillis() > e.expiresAt()) {
            store.remove(key, e); // Passive sweep
            return null;
        }
        return e.value();
    }
}`,
  },
};

export function HeroTerminal() {
  const [activeLang, setActiveLang] = useState<Language>("cpp");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const snippet = SNIPPETS[activeLang];
  const lines = snippet.code.split("\n");

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 650);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-[#141416] border border-white/10 shadow-2xl overflow-hidden font-mono text-xs select-none">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1b1b1f] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FBAE0C]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#09C899]/80" />
          <span className="ml-2 text-[11px] text-neutral-400 font-mono">
            {snippet.fileExt}
          </span>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 bg-black/30 p-0.5 rounded-lg border border-white/5">
          {(["cpp", "rust", "go", "python", "java"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-tight transition-colors ${
                activeLang === lang
                  ? "bg-white/15 text-white shadow-2xs font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {lang === "cpp" ? "C++" : lang === "rust" ? "Rust" : lang === "go" ? "Go" : lang === "python" ? "Python" : "Java"}
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="p-4 bg-[#141416] max-h-[290px] overflow-y-auto leading-relaxed text-neutral-200 flex font-mono text-[11px]">
        {/* Line Numbers */}
        <div className="text-neutral-600 select-none pr-4 text-right shrink-0">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Syntax-Colored Code Content */}
        <pre className="flex-1 overflow-x-auto text-neutral-100 font-mono">
          <code>{snippet.code}</code>
        </pre>
      </div>

      {/* Terminal Action / Benchmark Console Footer */}
      <div className="px-4 py-3 bg-[#18181b] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#09C899]/15 border border-[#09C899]/30 text-[#09C899] text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#09C899]" />
            <span>ACCEPTED</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-neutral-300 font-mono">
            <span className="font-bold text-white">101,170</span> ops/s
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400">p99:</span>
            <span className="font-bold text-[#099BE9]">0.12ms</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded text-[11px] text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-[#09C899]" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-3 py-1 rounded text-[11px] font-bold text-white bg-[#09C899] hover:bg-[#0AA793] shadow-md shadow-[#09C899]/20 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Play className={`w-3 h-3 fill-white ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Benchmarking..." : "Benchmark"}</span>
          </button>

          <Link
            href="/challenges/kv-store/workspace"
            className="px-2.5 py-1 rounded text-[11px] font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1 transition-colors"
          >
            <span>Arena</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
