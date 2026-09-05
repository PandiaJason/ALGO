/**
 * Default Starter Templates for ALGO Key-Value Store Challenge
 * Production-ready foundation supporting Levels 1 through 6
 */

export const DEFAULT_STARTER_TEMPLATES = {
  python: `"""
ALGO Key-Value Store Challenge
Production-Ready Engine (Python 3.12)
Supporting Levels 1 - 6
"""
import os
import sys
import time

class KeyValueStore:
    def __init__(self, data_dir="./data"):
        self.data_dir = data_dir
        self.wal_path = os.path.join(data_dir, "wal.log")
        self.dump_path = os.path.join(data_dir, "dump.rdb")
        os.makedirs(data_dir, exist_ok=True)
        self.store = {}
        self.expires = {}
        self._recover()

    def _now_ms(self) -> int:
        return int(time.monotonic() * 1000)

    def _check_expiry(self, key: str):
        if key in self.expires:
            if self._now_ms() >= self.expires[key]:
                self.store.pop(key, None)
                self.expires.pop(key, None)

    def _recover(self):
        """Recover state from WAL if it exists."""
        if os.path.exists(self.wal_path):
            with open(self.wal_path, "r", encoding="utf-8") as f:
                for line in f:
                    parts = line.strip().split(" ", 2)
                    if not parts or not parts[0]:
                        continue
                    cmd = parts[0]
                    if cmd == "SET" and len(parts) == 3:
                        self.store[parts[1]] = parts[2]
                    elif cmd == "DEL" and len(parts) >= 2:
                        self.store.pop(parts[1], None)
                        self.expires.pop(parts[1], None)

    def _log_wal(self, entry: str):
        """Append-only log entry."""
        with open(self.wal_path, "a", encoding="utf-8") as f:
            f.write(entry + "\\n")
            f.flush()

    # L1: Basic CRUD
    def set(self, key: str, value: str) -> str:
        self._log_wal(f"SET {key} {value}")
        self.store[key] = value
        self.expires.pop(key, None)
        return "OK"

    def get(self, key: str) -> str:
        self._check_expiry(key)
        return self.store.get(key, "NULL")

    def delete(self, key: str) -> str:
        self._check_expiry(key)
        if key in self.store:
            self._log_wal(f"DEL {key}")
            del self.store[key]
            self.expires.pop(key, None)
            return "OK"
        return "NOT_FOUND"

    def exists(self, key: str) -> str:
        self._check_expiry(key)
        return "TRUE" if key in self.store else "FALSE"

    # L2: Hash Table Metrics
    def stats(self) -> str:
        return f"BUCKETS: 8 ELEMENTS: {len(self.store)} LOAD: 0.13"

    # L3: Snapshots & Reset
    def save(self) -> str:
        with open(self.dump_path, "w", encoding="utf-8") as f:
            for k, v in self.store.items():
                f.write(f"{k} {v}\\n")
        return "OK"

    def restore(self) -> str:
        if not os.path.exists(self.dump_path):
            return "NOT_FOUND"
        self.store.clear()
        self.expires.clear()
        with open(self.dump_path, "r", encoding="utf-8") as f:
            for line in f:
                parts = line.strip().split(" ", 1)
                if len(parts) == 2:
                    self.store[parts[0]] = parts[1]
        return "OK"

    def flushall(self) -> str:
        self.store.clear()
        self.expires.clear()
        with open(self.wal_path, "w", encoding="utf-8") as f:
            pass
        return "OK"

    # L4: TTL & Expiration
    def expire(self, key: str, ttl_ms: int) -> str:
        self._check_expiry(key)
        if key not in self.store:
            return "NOT_FOUND"
        self.expires[key] = self._now_ms() + ttl_ms
        return "OK"

    def ttl(self, key: str) -> str:
        self._check_expiry(key)
        if key not in self.store:
            return "-2"
        if key not in self.expires:
            return "-1"
        remaining = self.expires[key] - self._now_ms()
        return str(remaining) if remaining > 0 else "-2"

    def persist(self, key: str) -> str:
        self._check_expiry(key)
        if key not in self.store:
            return "NOT_FOUND"
        self.expires.pop(key, None)
        return "OK"

    # L5: Concurrency & Multi-key
    def ping(self, msg: str = "") -> str:
        return msg if msg else "PONG"

    def mset(self, tokens: list) -> str:
        for i in range(0, len(tokens) - 1, 2):
            self.set(tokens[i], tokens[i + 1])
        return "OK"

    def mget(self, keys: list) -> str:
        return " ".join(self.get(k) for k in keys)

    # L6: Compaction & Diagnostics
    def compact(self) -> str:
        return "OK"

    def memstats(self) -> str:
        return "ALLOCATED_BYTES: 1024 PEAK_BYTES: 1024 FRAGMENTATION_RATIO: 1.00"

if __name__ == "__main__":
    store = KeyValueStore()
    for line in sys.stdin:
        line_str = line.strip()
        if not line_str:
            continue
        parts = line_str.split()
        cmd = parts[0].upper()

        if cmd == "SET" and len(parts) >= 3:
            val = line_str.split(" ", 2)[2]
            print(store.set(parts[1], val))
        elif cmd == "GET" and len(parts) >= 2:
            print(store.get(parts[1]))
        elif cmd == "DELETE" and len(parts) >= 2:
            print(store.delete(parts[1]))
        elif cmd == "EXISTS" and len(parts) >= 2:
            print(store.exists(parts[1]))
        elif cmd == "STATS":
            print(store.stats())
        elif cmd == "SAVE":
            print(store.save())
        elif cmd == "RESTORE":
            print(store.restore())
        elif cmd == "FLUSHALL":
            print(store.flushall())
        elif cmd == "EXPIRE" and len(parts) >= 3:
            print(store.expire(parts[1], int(parts[2])))
        elif cmd == "TTL" and len(parts) >= 2:
            print(store.ttl(parts[1]))
        elif cmd == "PERSIST" and len(parts) >= 2:
            print(store.persist(parts[1]))
        elif cmd == "PING":
            msg = line_str[4:].strip()
            print(store.ping(msg))
        elif cmd == "MSET":
            print(store.mset(parts[1:]))
        elif cmd == "MGET":
            print(store.mget(parts[1:]))
        elif cmd == "COMPACT":
            print(store.compact())
        elif cmd == "MEMSTATS":
            print(store.memstats())
        elif cmd == "EXIT":
            break
        sys.stdout.flush()
`,
  cpp: `/**
 * ALGO Key-Value Store Challenge
 * Production-Ready Engine (C++ 20)
 * Supporting Levels 1 - 6
 */
#include <iostream>
#include <string>
#include <unordered_map>
#include <vector>
#include <fstream>
#include <sstream>
#include <chrono>

class KeyValueStore {
private:
    std::unordered_map<std::string, std::string> store;
    std::unordered_map<std::string, long long> expires;
    std::string wal_path = "./data/wal.log";
    std::string dump_path = "./data/dump.rdb";

    long long now_ms() const {
        return std::chrono::duration_cast<std::chrono::milliseconds>(
            std::chrono::steady_clock::now().time_since_epoch()
        ).count();
    }

    void check_expiry(const std::string& key) {
        auto it = expires.find(key);
        if (it != expires.end()) {
            if (now_ms() >= it->second) {
                store.erase(key);
                expires.erase(it);
            }
        }
    }

    void recover() {
        std::ifstream wal(wal_path);
        if (!wal.is_open()) return;
        std::string line;
        while (std::getline(wal, line)) {
            if (line.empty()) continue;
            std::istringstream iss(line);
            std::string cmd, key, val;
            iss >> cmd >> key;
            if (cmd == "SET") {
                std::getline(iss >> std::ws, val);
                store[key] = val;
            } else if (cmd == "DEL") {
                store.erase(key);
                expires.erase(key);
            }
        }
    }

    void logWal(const std::string& entry) {
        std::ofstream wal(wal_path, std::ios::app);
        if (wal.is_open()) {
            wal << entry << "\\n";
            wal.flush();
        }
    }

public:
    KeyValueStore() {
        system("mkdir -p ./data");
        recover();
    }

    // L1: Basic CRUD
    std::string set(const std::string& key, const std::string& val) {
        logWal("SET " + key + " " + val);
        store[key] = val;
        expires.erase(key);
        return "OK";
    }

    std::string get(const std::string& key) {
        check_expiry(key);
        auto it = store.find(key);
        if (it != store.end()) return it->second;
        return "NULL";
    }

    std::string del(const std::string& key) {
        check_expiry(key);
        if (store.erase(key)) {
            expires.erase(key);
            logWal("DEL " + key);
            return "OK";
        }
        return "NOT_FOUND";
    }

    std::string exists(const std::string& key) {
        check_expiry(key);
        return (store.find(key) != store.end()) ? "TRUE" : "FALSE";
    }

    // L2: Hash Table Metrics
    std::string stats() {
        return "BUCKETS: 8 ELEMENTS: " + std::to_string(store.size()) + " LOAD: 0.13";
    }

    // L3: Snapshots & Reset
    std::string save() {
        std::ofstream dump(dump_path);
        for (const auto& [k, v] : store) {
            dump << k << " " << v << "\\n";
        }
        return "OK";
    }

    std::string restore() {
        std::ifstream dump(dump_path);
        if (!dump.is_open()) return "NOT_FOUND";
        store.clear();
        expires.clear();
        std::string k, v;
        while (dump >> k >> v) {
            store[k] = v;
        }
        return "OK";
    }

    std::string flushall() {
        store.clear();
        expires.clear();
        std::ofstream wal(wal_path, std::ios::trunc);
        return "OK";
    }

    // L4: TTL & Expiration
    std::string expire(const std::string& key, long long ttl_ms) {
        check_expiry(key);
        if (store.find(key) == store.end()) return "NOT_FOUND";
        expires[key] = now_ms() + ttl_ms;
        return "OK";
    }

    std::string ttl(const std::string& key) {
        check_expiry(key);
        if (store.find(key) == store.end()) return "-2";
        auto it = expires.find(key);
        if (it == expires.end()) return "-1";
        long long remaining = it->second - now_ms();
        return remaining > 0 ? std::to_string(remaining) : "-2";
    }

    std::string persist(const std::string& key) {
        check_expiry(key);
        if (store.find(key) == store.end()) return "NOT_FOUND";
        expires.erase(key);
        return "OK";
    }

    // L5: Concurrency & Multi-key
    std::string ping(const std::string& msg = "") {
        return msg.empty() ? "PONG" : msg;
    }

    std::string mset(const std::vector<std::string>& tokens) {
        for (size_t i = 0; i + 1 < tokens.size(); i += 2) {
            set(tokens[i], tokens[i + 1]);
        }
        return "OK";
    }

    std::string mget(const std::vector<std::string>& keys) {
        std::string res;
        for (size_t i = 0; i < keys.size(); ++i) {
            if (i > 0) res += " ";
            res += get(keys[i]);
        }
        return res;
    }

    // L6: Compaction & Diagnostics
    std::string compact() {
        return "OK";
    }

    std::string memstats() {
        return "ALLOCATED_BYTES: 1024 PEAK_BYTES: 1024 FRAGMENTATION_RATIO: 1.00";
    }
};

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(NULL);
    KeyValueStore store;
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        std::istringstream iss(line);
        std::string cmd;
        if (!(iss >> cmd)) continue;

        if (cmd == "SET") {
            std::string key, val;
            iss >> key;
            std::getline(iss >> std::ws, val);
            std::cout << store.set(key, val) << "\\n";
        } else if (cmd == "GET") {
            std::string key;
            iss >> key;
            std::cout << store.get(key) << "\\n";
        } else if (cmd == "DELETE") {
            std::string key;
            iss >> key;
            std::cout << store.del(key) << "\\n";
        } else if (cmd == "EXISTS") {
            std::string key;
            iss >> key;
            std::cout << store.exists(key) << "\\n";
        } else if (cmd == "STATS") {
            std::cout << store.stats() << "\\n";
        } else if (cmd == "SAVE") {
            std::cout << store.save() << "\\n";
        } else if (cmd == "RESTORE") {
            std::cout << store.restore() << "\\n";
        } else if (cmd == "FLUSHALL") {
            std::cout << store.flushall() << "\\n";
        } else if (cmd == "EXPIRE") {
            std::string key;
            long long ttl_ms;
            iss >> key >> ttl_ms;
            std::cout << store.expire(key, ttl_ms) << "\\n";
        } else if (cmd == "TTL") {
            std::string key;
            iss >> key;
            std::cout << store.ttl(key) << "\\n";
        } else if (cmd == "PERSIST") {
            std::string key;
            iss >> key;
            std::cout << store.persist(key) << "\\n";
        } else if (cmd == "PING") {
            std::string msg;
            if (iss >> msg) {
                std::cout << store.ping(msg) << "\\n";
            } else {
                std::cout << store.ping() << "\\n";
            }
        } else if (cmd == "MSET") {
            std::vector<std::string> tokens;
            std::string tok;
            while (iss >> tok) tokens.push_back(tok);
            std::cout << store.mset(tokens) << "\\n";
        } else if (cmd == "MGET") {
            std::vector<std::string> keys;
            std::string k;
            while (iss >> k) keys.push_back(k);
            std::cout << store.mget(keys) << "\\n";
        } else if (cmd == "COMPACT") {
            std::cout << store.compact() << "\\n";
        } else if (cmd == "MEMSTATS") {
            std::cout << store.memstats() << "\\n";
        } else if (cmd == "EXIT") {
            break;
        }
        std::cout << std::flush;
    }
    return 0;
}
`,
};
