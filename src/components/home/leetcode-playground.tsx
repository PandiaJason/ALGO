"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Copy,
  Check,
  ChevronRight,
  Code2,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function LeetCodePlayground() {
  const [language, setLanguage] = useState<"python" | "cpp" | "rust" | "go" | "java">("python");
  const [selectedSnippet, setSelectedSnippet] = useState<string>("kv");
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [copied, setCopied] = useState(false);

  const snippets: Record<
    string,
    {
      title: string;
      python: string;
      cpp: string;
      rust: string;
      go: string;
      java: string;
    }
  > = {
    kv: {
      title: "Key-Value Store (Hash & TTL)",
      python: `class KeyValueStore:
    def __init__(self):
        self.store = {}          # O(1) hash map

    def set(self, key: str, value: str, ttl_ms: int = None) -> bool:
        expire_at = (time.monotonic() + ttl_ms/1000.0) if ttl_ms else None
        self.store[key] = (value, expire_at)
        return True

    def get(self, key: str) -> str | None:
        entry = self.store.get(key)
        if not entry:
            return None
        val, expire_at = entry
        if expire_at and time.monotonic() > expire_at:
            del self.store[key]  # Passive TTL eviction
            return None
        return val`,
      cpp: `class KeyValueStore {
private:
    struct Entry {
        std::string value;
        std::optional<std::chrono::steady_clock::time_point> expires_at;
    };
    std::unordered_map<std::string, Entry> store_;
    mutable std::shared_mutex rw_mutex_;

public:
    void set(const std::string& key, std::string val, std::optional<int64_t> ttl_ms) {
        std::unique_lock lock(rw_mutex_);
        auto exp = ttl_ms ? std::make_optional(std::chrono::steady_clock::now() + std::chrono::milliseconds(*ttl_ms)) : std::nullopt;
        store_[key] = {std::move(val), exp};
    }

    std::optional<std::string> get(const std::string& key) {
        std::shared_lock lock(rw_mutex_);
        auto it = store_.find(key);
        if (it == store_.end()) return std::nullopt;
        if (it->second.expires_at && std::chrono::steady_clock::now() > *it->second.expires_at) {
            return std::nullopt; // Passive TTL eviction
        }
        return it->second.value;
    }
};`,
      rust: `struct Entry {
    value: String,
    expires_at: Option<Instant>,
}

pub struct KeyValueStore {
    store: HashMap<String, Entry>,
    lock: RwLock<()>,
}

impl KeyValueStore {
    pub fn set(&mut self, key: String, val: String, ttl_ms: Option<u64>) {
        let expire = ttl_ms.map(|t| Instant::now() + Duration::from_millis(t));
        self.store.insert(key, Entry { value: val, expires_at: expire });
    }

    pub fn get(&self, key: &str) -> Option<&String> {
        let entry = self.store.get(key)?;
        if let Some(exp) = entry.expires_at {
            if Instant::now() > exp { return None; } // Passive TTL eviction
        }
        Some(&entry.value)
    }
}`,
      go: `type Entry struct {
    value     string
    expiresAt time.Time
}

type KeyValueStore struct {
    mu    sync.RWMutex
    store map[string]Entry
}

func (kvs *KeyValueStore) Set(key, val string, ttlMs int64) {
    kvs.mu.Lock()
    defer kvs.mu.Unlock()
    var exp time.Time
    if ttlMs > 0 {
        exp = time.Now().Add(time.Duration(ttlMs) * time.Millisecond)
    }
    kvs.store[key] = Entry{value: val, expiresAt: exp}
}

func (kvs *KeyValueStore) Get(key string) (string, bool) {
    kvs.mu.RLock()
    defer kvs.mu.RUnlock()
    entry, ok := kvs.store[key]
    if !ok || (!entry.expiresAt.IsZero() && time.Now().After(entry.expiresAt)) {
        return "", false // Passive TTL eviction
    }
    return entry.value, true
}`,
      java: `public class KeyValueStore {
    private record Entry(String value, long expiresAt) {}
    private final ConcurrentHashMap<String, Entry> store = new ConcurrentHashMap<>();

    public void set(String key, String value, Long ttlMs) {
        long expireAt = ttlMs != null ? System.currentTimeMillis() + ttlMs : -1;
        store.put(key, new Entry(value, expireAt));
    }

    public String get(String key) {
        Entry e = store.get(key);
        if (e == null) return null;
        if (e.expiresAt > 0 && System.currentTimeMillis() > e.expiresAt) {
            store.remove(key); // Passive TTL eviction
            return null;
        }
        return e.value;
    }
}`,
    },
    wal: {
      title: "Append-Only WAL (Crash Recovery)",
      python: `class WriteAheadLog:
    def __init__(self, path: str = "wal.log"):
        self.file = open(path, "a", buffering=1)

    def append(self, cmd: str) -> None:
        self.file.write(f"{cmd}\\n")
        self.file.flush()
        os.fdatasync(self.file.fileno())`,
      cpp: `class WriteAheadLog {
    int fd_;
public:
    explicit WriteAheadLog(const std::string& path) {
        fd_ = open(path.c_str(), O_WRONLY | O_CREAT | O_APPEND, 0644);
    }
    void append(const std::string& entry) {
        write(fd_, entry.data(), entry.size());
        fdatasync(fd_); // Hardware durability
    }
};`,
      rust: `pub struct WriteAheadLog {
    file: File,
}

impl WriteAheadLog {
    pub fn new(path: &str) -> Result<Self> {
        let file = OpenOptions::new().create(true).append(true).open(path)?;
        Ok(Self { file })
    }

    pub fn append(&mut self, cmd: &str) -> Result<()> {
        writeln!(self.file, "{}", cmd)?;
        self.file.sync_data()?; // Hardware durability
        Ok(())
    }
}`,
      go: `type WriteAheadLog struct {
    file *os.File
}

func NewWAL(path string) (*WriteAheadLog, error) {
    f, err := os.OpenFile(path, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
    if err != nil {
        return nil, err
    }
    return &WriteAheadLog{file: f}, nil
}

func (w *WriteAheadLog) Append(entry string) error {
    if _, err := fmt.Fprintf(w.file, "%s\\n", entry); err != nil {
        return err
    }
    return w.file.Sync() // Hardware durability
}`,
      java: `public class WriteAheadLog {
    private final FileOutputStream fos;
    private final FileChannel channel;

    public WriteAheadLog(String path) throws IOException {
        this.fos = new FileOutputStream(path, true);
        this.channel = fos.getChannel();
    }

    public synchronized void append(String entry) throws IOException {
        fos.write((entry + "\\n").getBytes(StandardCharsets.UTF_8));
        fos.flush();
        channel.force(true); // Hardware durability
    }
}`,
    },
    queue: {
      title: "Lock-Free Ring Buffer (Concurrency)",
      python: `import queue

class ThreadSafeBuffer:
    def __init__(self, maxsize: int = 10_000):
        self.q = queue.Queue(maxsize=maxsize)

    def push(self, item) -> bool:
        try:
            self.q.put_nowait(item)
            return True
        except queue.Full:
            return False`,
      cpp: `template<typename T, size_t Capacity>
class LockFreeQueue {
    std::array<T, Capacity> buffer_;
    std::atomic<size_t> head_{0};
    std::atomic<size_t> tail_{0};
public:
    bool push(const T& item) {
        size_t t = tail_.load(std::memory_order_relaxed);
        if (t - head_.load(std::memory_order_acquire) >= Capacity) return false;
        buffer_[t % Capacity] = item;
        tail_.store(t + 1, std::memory_order_release);
        return true;
    }
};`,
      rust: `pub struct RingBuffer<T, const CAP: usize> {
    buffer: [Option<T>; CAP],
    head: AtomicUsize,
    tail: AtomicUsize,
}

impl<T: Copy, const CAP: usize> RingBuffer<T, CAP> {
    pub fn push(&mut self, item: T) -> bool {
        let t = self.tail.load(Ordering::Relaxed);
        let h = self.head.load(Ordering::Acquire);
        if t - h >= CAP { return false; } // Buffer full
        self.buffer[t % CAP] = Some(item);
        self.tail.store(t + 1, Ordering::Release);
        true
    }
}`,
      go: `type RingBuffer[T any] struct {
    buffer []T
    cap    uint64
    head   atomic.Uint64
    tail   atomic.Uint64
}

func (r *RingBuffer[T]) Push(item T) bool {
    t := r.tail.Load()
    h := r.head.Load()
    if t-h >= r.cap {
        return false // Buffer full
    }
    r.buffer[t%r.cap] = item
    r.tail.Add(1)
    return true
}`,
      java: `public class LockFreeRingBuffer<T> {
    private final AtomicReferenceArray<T> buffer;
    private final AtomicLong head = new AtomicLong(0);
    private final AtomicLong tail = new AtomicLong(0);
    private final int capacity;

    public LockFreeRingBuffer(int capacity) {
        this.capacity = capacity;
        this.buffer = new AtomicReferenceArray<>(capacity);
    }

    public boolean push(T item) {
        long t = tail.get();
        if (t - head.get() >= capacity) return false; // Buffer full
        buffer.set((int) (t % capacity), item);
        return tail.compareAndSet(t, t + 1);
    }
}`,
    },
  };

  const currentCode =
    snippets[selectedSnippet]?.[language] ||
    snippets[selectedSnippet]?.python ||
    "";

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = currentCode.split("\n");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start max-w-5xl mx-auto">
      {/* Code Editor Frame (Left 8 cols) */}
      <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden font-mono text-xs">
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-[#f8fafc]">
          <div className="flex items-center gap-1 overflow-x-auto">
            {(
              [
                { id: "python", label: "Python 3.12" },
                { id: "cpp", label: "C++ 20" },
                { id: "rust", label: "Rust" },
                { id: "go", label: "Go" },
                { id: "java", label: "Java 21" },
              ] as const
            ).map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  language === lang.id
                    ? "bg-slate-200/90 text-slate-900 font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-slate-600 hover:text-slate-900 px-2 py-1 rounded flex items-center gap-1 text-xs"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#09C899]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="bg-[#09C899] hover:bg-[#0AA793] text-white px-3 py-1 rounded flex items-center gap-1.5 text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <Play className={`w-3 h-3 fill-white ${isRunning ? "animate-spin" : ""}`} />
              <span>{isRunning ? "Testing..." : "Run"}</span>
            </button>

            <Link href="/challenges/kv-store/workspace">
              <span className="bg-[#262626] hover:bg-[#333] text-white px-2.5 py-1 rounded flex items-center gap-1 text-xs font-medium cursor-pointer">
                <span>Playground</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Code Lines Display */}
        <div className="p-4 bg-white overflow-x-auto max-h-[320px] leading-relaxed text-slate-800 select-text flex">
          {/* Line Numbers */}
          <div className="text-slate-300 select-none pr-4 text-right">
            {codeLines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code Text */}
          <pre className="flex-1 font-mono">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Output Console Banner */}
        <div className="px-4 py-2.5 bg-[#f8fafc] border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#09C899]" />
            <span className="text-[#0AA793] font-bold">Accepted</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-700 font-semibold">101,170 ops/s</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">p99: 0.12ms</span>
          </div>

          <span className="text-[11px] text-slate-400">Sandbox: algo-runner</span>
        </div>
      </div>

      {/* Right Side Quick Selector Links (Matches Screenshot 3) */}
      <div className="lg:col-span-4 space-y-3">
        {Object.entries(snippets).map(([key, s]) => (
          <button
            key={key}
            onClick={() => setSelectedSnippet(key)}
            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
              selectedSnippet === key
                ? "border-[#099BE9] bg-[#099BE9]/5 shadow-xs"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  selectedSnippet === key
                    ? "bg-[#099BE9] text-white"
                    : "bg-slate-100 text-slate-600 group-hover:text-slate-900"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-800">
                {s.title}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}

        <div className="pt-2">
          <Link
            href="/challenges/kv-store/workspace"
            className="text-xs font-semibold text-[#099BE9] hover:text-[#1984E9] flex items-center gap-1.5"
          >
            <span>Create Playground &amp; Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
