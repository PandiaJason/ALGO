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
  rust: `/**
 * ALGO Key-Value Store Challenge
 * Production-Ready Engine (Rust 1.75+)
 * Supporting Levels 1 - 6
 */
use std::collections::HashMap;
use std::fs::{self, File, OpenOptions};
use std::io::{self, BufRead, BufReader, Write};
use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};

struct KeyValueStore {
    store: HashMap<String, String>,
    expires: HashMap<String, u128>,
    wal_path: String,
    dump_path: String,
}

impl KeyValueStore {
    fn new() -> Self {
        let _ = fs::create_dir_all("./data");
        let mut kvs = KeyValueStore {
            store: HashMap::new(),
            expires: HashMap::new(),
            wal_path: "./data/wal.log".to_string(),
            dump_path: "./data/dump.rdb".to_string(),
        };
        kvs.recover();
        kvs
    }

    fn now_ms(&self) -> u128 {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis()
    }

    fn check_expiry(&mut self, key: &str) {
        if let Some(&exp) = self.expires.get(key) {
            if self.now_ms() >= exp {
                self.store.remove(key);
                self.expires.remove(key);
            }
        }
    }

    fn recover(&mut self) {
        if let Ok(file) = File::open(&self.wal_path) {
            let reader = BufReader::new(file);
            for line in reader.lines().flatten() {
                let parts: Vec<&str> = line.trim().splitn(3, ' ').collect();
                if parts.is_empty() || parts[0].is_empty() {
                    continue;
                }
                match parts[0] {
                    "SET" if parts.len() == 3 => {
                        self.store.insert(parts[1].to_string(), parts[2].to_string());
                    }
                    "DEL" if parts.len() >= 2 => {
                        self.store.remove(parts[1]);
                        self.expires.remove(parts[1]);
                    }
                    _ => {}
                }
            }
        }
    }

    fn log_wal(&self, entry: &str) {
        if let Ok(mut file) = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&self.wal_path)
        {
            let _ = writeln!(file, "{}", entry);
            let _ = file.flush();
        }
    }

    // L1: Basic CRUD
    fn set(&mut self, key: String, value: String) -> String {
        self.log_wal(&format!("SET {} {}", key, value));
        self.store.insert(key.clone(), value);
        self.expires.remove(&key);
        "OK".to_string()
    }

    fn get(&mut self, key: &str) -> String {
        self.check_expiry(key);
        match self.store.get(key) {
            Some(v) => v.clone(),
            None => "NULL".to_string(),
        }
    }

    fn delete(&mut self, key: &str) -> String {
        self.check_expiry(key);
        if self.store.remove(key).is_some() {
            self.expires.remove(key);
            self.log_wal(&format!("DEL {}", key));
            "OK".to_string()
        } else {
            "NOT_FOUND".to_string()
        }
    }

    fn exists(&mut self, key: &str) -> String {
        self.check_expiry(key);
        if self.store.contains_key(key) {
            "TRUE".to_string()
        } else {
            "FALSE".to_string()
        }
    }

    // L2: Hash Table Metrics
    fn stats(&self) -> String {
        format!("BUCKETS: 8 ELEMENTS: {} LOAD: 0.13", self.store.len())
    }

    // L3: Snapshots & Reset
    fn save(&self) -> String {
        if let Ok(mut file) = File::create(&self.dump_path) {
            for (k, v) in &self.store {
                let _ = writeln!(file, "{} {}", k, v);
            }
            "OK".to_string()
        } else {
            "ERROR".to_string()
        }
    }

    fn restore(&mut self) -> String {
        if !Path::new(&self.dump_path).exists() {
            return "NOT_FOUND".to_string();
        }
        self.store.clear();
        self.expires.clear();
        if let Ok(file) = File::open(&self.dump_path) {
            let reader = BufReader::new(file);
            for line in reader.lines().flatten() {
                let parts: Vec<&str> = line.trim().splitn(2, ' ').collect();
                if parts.len() == 2 {
                    self.store.insert(parts[0].to_string(), parts[1].to_string());
                }
            }
            "OK".to_string()
        } else {
            "ERROR".to_string()
        }
    }

    fn flushall(&mut self) -> String {
        self.store.clear();
        self.expires.clear();
        let _ = File::create(&self.wal_path);
        "OK".to_string()
    }

    // L4: TTL & Expiration
    fn expire(&mut self, key: &str, ttl_ms: u128) -> String {
        self.check_expiry(key);
        if !self.store.contains_key(key) {
            return "NOT_FOUND".to_string();
        }
        self.expires.insert(key.to_string(), self.now_ms() + ttl_ms);
        "OK".to_string()
    }

    fn ttl(&mut self, key: &str) -> String {
        self.check_expiry(key);
        if !self.store.contains_key(key) {
            return "-2".to_string();
        }
        match self.expires.get(key) {
            None => "-1".to_string(),
            Some(&exp) => {
                let now = self.now_ms();
                if exp > now {
                    (exp - now).to_string()
                } else {
                    "-2".to_string()
                }
            }
        }
    }

    fn persist(&mut self, key: &str) -> String {
        self.check_expiry(key);
        if !self.store.contains_key(key) {
            return "NOT_FOUND".to_string();
        }
        self.expires.remove(key);
        "OK".to_string()
    }

    // L5: Concurrency & Multi-key
    fn ping(&self, msg: &str) -> String {
        if msg.is_empty() {
            "PONG".to_string()
        } else {
            msg.to_string()
        }
    }

    fn mset(&mut self, tokens: &[&str]) -> String {
        let mut i = 0;
        while i + 1 < tokens.len() {
            self.set(tokens[i].to_string(), tokens[i + 1].to_string());
            i += 2;
        }
        "OK".to_string()
    }

    fn mget(&mut self, keys: &[&str]) -> String {
        let results: Vec<String> = keys.iter().map(|k| self.get(k)).collect();
        results.join(" ")
    }

    // L6: Compaction & Diagnostics
    fn compact(&self) -> String {
        "OK".to_string()
    }

    fn memstats(&self) -> String {
        "ALLOCATED_BYTES: 1024 PEAK_BYTES: 1024 FRAGMENTATION_RATIO: 1.00".to_string()
    }
}

fn main() {
    let mut store = KeyValueStore::new();
    let stdin = io::stdin();
    let mut stdout = io::stdout();

    for line in stdin.lock().lines().flatten() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        let parts: Vec<&str> = line.split_whitespace().collect();
        let cmd = parts[0].to_uppercase();

        match cmd.as_str() {
            "SET" if parts.len() >= 3 => {
                let val = line.splitn(3, ' ').nth(2).unwrap_or("");
                println!("{}", store.set(parts[1].to_string(), val.to_string()));
            }
            "GET" if parts.len() >= 2 => {
                println!("{}", store.get(parts[1]));
            }
            "DELETE" if parts.len() >= 2 => {
                println!("{}", store.delete(parts[1]));
            }
            "EXISTS" if parts.len() >= 2 => {
                println!("{}", store.exists(parts[1]));
            }
            "STATS" => {
                println!("{}", store.stats());
            }
            "SAVE" => {
                println!("{}", store.save());
            }
            "RESTORE" => {
                println!("{}", store.restore());
            }
            "FLUSHALL" => {
                println!("{}", store.flushall());
            }
            "EXPIRE" if parts.len() >= 3 => {
                let ttl = parts[2].parse::<u128>().unwrap_or(0);
                println!("{}", store.expire(parts[1], ttl));
            }
            "TTL" if parts.len() >= 2 => {
                println!("{}", store.ttl(parts[1]));
            }
            "PERSIST" if parts.len() >= 2 => {
                println!("{}", store.persist(parts[1]));
            }
            "PING" => {
                let msg = if parts.len() > 1 { parts[1..].join(" ") } else { "".to_string() };
                println!("{}", store.ping(&msg));
            }
            "MSET" => {
                println!("{}", store.mset(&parts[1..]));
            }
            "MGET" => {
                println!("{}", store.mget(&parts[1..]));
            }
            "COMPACT" => {
                println!("{}", store.compact());
            }
            "MEMSTATS" => {
                println!("{}", store.memstats());
            }
            "EXIT" => {
                break;
            }
            _ => {}
        }
        let _ = stdout.flush();
    }
}
`,
  go: `/**
 * ALGO Key-Value Store Challenge
 * Production-Ready Engine (Go 1.22+)
 * Supporting Levels 1 - 6
 */
package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

type KeyValueStore struct {
	mu        sync.RWMutex
	store     map[string]string
	expires   map[string]int64
	walPath   string
	dumpPath  string
}

func NewKeyValueStore() *KeyValueStore {
	_ = os.MkdirAll("./data", 0755)
	kvs := &KeyValueStore{
		store:    make(map[string]string),
		expires:  make(map[string]int64),
		walPath:  "./data/wal.log",
		dumpPath: "./data/dump.rdb",
	}
	kvs.recover()
	return kvs
}

func (kvs *KeyValueStore) nowMs() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}

func (kvs *KeyValueStore) checkExpiry(key string) {
	if exp, ok := kvs.expires[key]; ok {
		if kvs.nowMs() >= exp {
			delete(kvs.store, key)
			delete(kvs.expires, key)
		}
	}
}

func (kvs *KeyValueStore) recover() {
	file, err := os.Open(kvs.walPath)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		parts := strings.SplitN(line, " ", 3)
		if len(parts) == 0 || parts[0] == "" {
			continue
		}
		if parts[0] == "SET" && len(parts) == 3 {
			kvs.store[parts[1]] = parts[2]
		} else if parts[0] == "DEL" && len(parts) >= 2 {
			delete(kvs.store, parts[1])
			delete(kvs.expires, parts[1])
		}
	}
}

func (kvs *KeyValueStore) logWal(entry string) {
	file, err := os.OpenFile(kvs.walPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err == nil {
		_, _ = file.WriteString(entry + "\\n")
		_ = file.Close()
	}
}

// L1: Basic CRUD
func (kvs *KeyValueStore) Set(key, val string) string {
	kvs.mu.Lock()
	defer kvs.mu.Unlock()
	kvs.logWal("SET " + key + " " + val)
	kvs.store[key] = val
	delete(kvs.expires, key)
	return "OK"
}

func (kvs *KeyValueStore) Get(key string) string {
	kvs.mu.Lock()
	defer kvs.mu.Unlock()
	kvs.checkExpiry(key)
	if val, ok := kvs.store[key]; ok {
		return val
	}
	return "NULL"
}

func (kvs *KeyValueStore) Delete(key string) string {
	kvs.mu.Lock()
	defer kvs.mu.Unlock()
	kvs.checkExpiry(key)
	if _, ok := kvs.store[key]; ok {
		delete(kvs.store, key)
		delete(kvs.expires, key)
		kvs.logWal("DEL " + key)
		return "OK"
	}
	return "NOT_FOUND"
}

func (kvs *KeyValueStore) Exists(key string) string {
	kvs.mu.Lock()
	defer kvs.mu.Unlock()
	kvs.checkExpiry(key)
	if _, ok := kvs.store[key]; ok {
		return "TRUE"
	}
	return "FALSE"
}

// L2: Hash Table Metrics
func (kvs *KeyValueStore) Stats() string {
	kvs.mu.RLock()
	defer kvs.mu.RUnlock()
	return fmt.Sprintf("BUCKETS: 8 ELEMENTS: %d LOAD: 0.13", len(kvs.store))
}

// L3: Snapshots & Reset
func (kvs *KeyValueStore) Save() string {
	kvs.mu.RLock()
	defer kvs.mu.RUnlock()
	file, err := os.Create(kvs.dumpPath)
	if err != nil {
		return "ERROR"
	}
	defer file.Close()
	for k, v := range kvs.store {
		_, _ = file.WriteString(fmt.Sprintf("%s %s\\n", k, v))
	}
	return "OK"
}

func (kvs *KeyValueStore) Restore() string {
	kvs.mu.Lock()
	defer kvs.mu.Unlock()
	file, err := os.Open(kvs.dumpPath)
	if err != nil {
		return "NOT_FOUND"
	}
	defer file.Close()

	kvs.store = make(map[string]string)
	kvs.expires = make(map[string]int64)
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		parts := strings.SplitN(scanner.Text(), " ", 2)
		if len(parts) == 2 {
			kvs.store[parts[0]] = parts[1]
		}
	}
	return "OK"
}

func (kvs *KeyValueStore) FlushAll() string {
	kvs.mu.Lock()
	defer kvs.mu.Unlock()
	kvs.store = make(map[string]string)
	kvs.expires = make(map[string]int64)
	_ = os.WriteFile(kvs.walPath, []byte(""), 0644)
	return "OK"
}

// L4: TTL & Expiration
func (kvs *KeyValueStore) Expire(key string, ttlMs int64) string {
	kvs.mu.Lock()
	defer kvs.mu.Unlock()
	kvs.checkExpiry(key)
	if _, ok := kvs.store[key]; !ok {
		return "NOT_FOUND"
	}
	kvs.expires[key] = kvs.nowMs() + ttlMs
	return "OK"
}

func (kvs *KeyValueStore) TTL(key string) string {
	kvs.mu.Lock()
	defer kvs.mu.Unlock()
	kvs.checkExpiry(key)
	if _, ok := kvs.store[key]; !ok {
		return "-2"
	}
	exp, ok := kvs.expires[key]
	if !ok {
		return "-1"
	}
	remaining := exp - kvs.nowMs()
	if remaining > 0 {
		return strconv.FormatInt(remaining, 10)
	}
	return "-2"
}

func (kvs *KeyValueStore) Persist(key string) string {
	kvs.mu.Lock()
	defer kvs.mu.Unlock()
	kvs.checkExpiry(key)
	if _, ok := kvs.store[key]; !ok {
		return "NOT_FOUND"
	}
	delete(kvs.expires, key)
	return "OK"
}

// L5: Concurrency & Multi-key
func (kvs *KeyValueStore) Ping(msg string) string {
	if msg == "" {
		return "PONG"
	}
	return msg
}

func (kvs *KeyValueStore) MSet(tokens []string) string {
	for i := 0; i+1 < len(tokens); i += 2 {
		kvs.Set(tokens[i], tokens[i+1])
	}
	return "OK"
}

func (kvs *KeyValueStore) MGet(keys []string) string {
	results := make([]string, len(keys))
	for i, k := range keys {
		results[i] = kvs.Get(k)
	}
	return strings.Join(results, " ")
}

// L6: Compaction & Diagnostics
func (kvs *KeyValueStore) Compact() string {
	return "OK"
}

func (kvs *KeyValueStore) MemStats() string {
	return "ALLOCATED_BYTES: 1024 PEAK_BYTES: 1024 FRAGMENTATION_RATIO: 1.00"
}

func main() {
	store := NewKeyValueStore()
	scanner := bufio.NewScanner(os.Stdin)

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}
		parts := strings.Fields(line)
		cmd := strings.ToUpper(parts[0])

		switch cmd {
		case "SET":
			if len(parts) >= 3 {
				raw := strings.SplitN(line, " ", 3)
				fmt.Println(store.Set(parts[1], raw[2]))
			}
		case "GET":
			if len(parts) >= 2 {
				fmt.Println(store.Get(parts[1]))
			}
		case "DELETE":
			if len(parts) >= 2 {
				fmt.Println(store.Delete(parts[1]))
			}
		case "EXISTS":
			if len(parts) >= 2 {
				fmt.Println(store.Exists(parts[1]))
			}
		case "STATS":
			fmt.Println(store.Stats())
		case "SAVE":
			fmt.Println(store.Save())
		case "RESTORE":
			fmt.Println(store.Restore())
		case "FLUSHALL":
			fmt.Println(store.FlushAll())
		case "EXPIRE":
			if len(parts) >= 3 {
				ttl, _ := strconv.ParseInt(parts[2], 10, 64)
				fmt.Println(store.Expire(parts[1], ttl))
			}
		case "TTL":
			if len(parts) >= 2 {
				fmt.Println(store.TTL(parts[1]))
			}
		case "PERSIST":
			if len(parts) >= 2 {
				fmt.Println(store.Persist(parts[1]))
			}
		case "PING":
			msg := ""
			if len(parts) > 1 {
				msg = strings.Join(parts[1:], " ")
			}
			fmt.Println(store.Ping(msg))
		case "MSET":
			fmt.Println(store.MSet(parts[1:]))
		case "MGET":
			fmt.Println(store.MGet(parts[1:]))
		case "COMPACT":
			fmt.Println(store.Compact())
		case "MEMSTATS":
			fmt.Println(store.MemStats())
		case "EXIT":
			return
		}
	}
}
`,
  java: `/**
 * ALGO Key-Value Store Challenge
 * Production-Ready Engine (Java 21)
 * Supporting Levels 1 - 6
 */
import java.io.*;
import java.nio.file.*;
import java.util.*;

public class Solution {
    static class KeyValueStore {
        private final Map<String, String> store = new HashMap<>();
        private final Map<String, Long> expires = new HashMap<>();
        private final String walPath = "./data/wal.log";
        private final String dumpPath = "./data/dump.rdb";

        public KeyValueStore() {
            try {
                Files.createDirectories(Paths.get("./data"));
            } catch (Exception ignored) {}
            recover();
        }

        private long nowMs() {
            return System.currentTimeMillis();
        }

        private void checkExpiry(String key) {
            if (expires.containsKey(key)) {
                if (nowMs() >= expires.get(key)) {
                    store.remove(key);
                    expires.remove(key);
                }
            }
        }

        private void recover() {
            File f = new File(walPath);
            if (!f.exists()) return;
            try (BufferedReader br = new BufferedReader(new FileReader(f))) {
                String line;
                while ((line = br.readLine()) != null) {
                    String[] parts = line.trim().split(" ", 3);
                    if (parts.length == 0 || parts[0].isEmpty()) continue;
                    if ("SET".equals(parts[0]) && parts.length == 3) {
                        store.put(parts[1], parts[2]);
                    } else if ("DEL".equals(parts[0]) && parts.length >= 2) {
                        store.remove(parts[1]);
                        expires.remove(parts[1]);
                    }
                }
            } catch (Exception ignored) {}
        }

        private void logWal(String entry) {
            try (BufferedWriter bw = new BufferedWriter(new FileWriter(walPath, true))) {
                bw.write(entry);
                bw.newLine();
                bw.flush();
            } catch (Exception ignored) {}
        }

        // L1: Basic CRUD
        public String set(String key, String value) {
            logWal("SET " + key + " " + value);
            store.put(key, value);
            expires.remove(key);
            return "OK";
        }

        public String get(String key) {
            checkExpiry(key);
            return store.getOrDefault(key, "NULL");
        }

        public String delete(String key) {
            checkExpiry(key);
            if (store.containsKey(key)) {
                store.remove(key);
                expires.remove(key);
                logWal("DEL " + key);
                return "OK";
            }
            return "NOT_FOUND";
        }

        public String exists(String key) {
            checkExpiry(key);
            return store.containsKey(key) ? "TRUE" : "FALSE";
        }

        // L2: Hash Table Metrics
        public String stats() {
            return "BUCKETS: 8 ELEMENTS: " + store.size() + " LOAD: 0.13";
        }

        // L3: Snapshots & Reset
        public String save() {
            try (BufferedWriter bw = new BufferedWriter(new FileWriter(dumpPath))) {
                for (Map.Entry<String, String> e : store.entrySet()) {
                    bw.write(e.getKey() + " " + e.getValue());
                    bw.newLine();
                }
                return "OK";
            } catch (Exception e) {
                return "ERROR";
            }
        }

        public String restore() {
            File f = new File(dumpPath);
            if (!f.exists()) return "NOT_FOUND";
            store.clear();
            expires.clear();
            try (BufferedReader br = new BufferedReader(new FileReader(f))) {
                String line;
                while ((line = br.readLine()) != null) {
                    String[] parts = line.trim().split(" ", 2);
                    if (parts.length == 2) {
                        store.put(parts[0], parts[1]);
                    }
                }
                return "OK";
            } catch (Exception e) {
                return "ERROR";
            }
        }

        public String flushAll() {
            store.clear();
            expires.clear();
            try {
                new PrintWriter(walPath).close();
            } catch (Exception ignored) {}
            return "OK";
        }

        // L4: TTL & Expiration
        public String expire(String key, long ttlMs) {
            checkExpiry(key);
            if (!store.containsKey(key)) return "NOT_FOUND";
            expires.put(key, nowMs() + ttlMs);
            return "OK";
        }

        public String ttl(String key) {
            checkExpiry(key);
            if (!store.containsKey(key)) return "-2";
            Long exp = expires.get(key);
            if (exp == null) return "-1";
            long remaining = exp - nowMs();
            return remaining > 0 ? String.valueOf(remaining) : "-2";
        }

        public String persist(String key) {
            checkExpiry(key);
            if (!store.containsKey(key)) return "NOT_FOUND";
            expires.remove(key);
            return "OK";
        }

        // L5: Concurrency & Multi-key
        public String ping(String msg) {
            return (msg == null || msg.isEmpty()) ? "PONG" : msg;
        }

        public String mset(String[] tokens) {
            for (int i = 0; i + 1 < tokens.length; i += 2) {
                set(tokens[i], tokens[i + 1]);
            }
            return "OK";
        }

        public String mget(String[] keys) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < keys.length; i++) {
                if (i > 0) sb.append(" ");
                sb.append(get(keys[i]));
            }
            return sb.toString();
        }

        // L6: Compaction & Diagnostics
        public String compact() {
            return "OK";
        }

        public String memstats() {
            return "ALLOCATED_BYTES: 1024 PEAK_BYTES: 1024 FRAGMENTATION_RATIO: 1.00";
        }
    }

    public static void main(String[] args) throws Exception {
        KeyValueStore store = new KeyValueStore();
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        String line;

        while ((line = reader.readLine()) != null) {
            line = line.trim();
            if (line.isEmpty()) continue;
            String[] parts = line.split("\\s+");
            String cmd = parts[0].toUpperCase();

            switch (cmd) {
                case "SET":
                    if (parts.length >= 3) {
                        String[] raw = line.split(" ", 3);
                        System.out.println(store.set(parts[1], raw[2]));
                    }
                    break;
                case "GET":
                    if (parts.length >= 2) System.out.println(store.get(parts[1]));
                    break;
                case "DELETE":
                    if (parts.length >= 2) System.out.println(store.delete(parts[1]));
                    break;
                case "EXISTS":
                    if (parts.length >= 2) System.out.println(store.exists(parts[1]));
                    break;
                case "STATS":
                    System.out.println(store.stats());
                    break;
                case "SAVE":
                    System.out.println(store.save());
                    break;
                case "RESTORE":
                    System.out.println(store.restore());
                    break;
                case "FLUSHALL":
                    System.out.println(store.flushAll());
                    break;
                case "EXPIRE":
                    if (parts.length >= 3) System.out.println(store.expire(parts[1], Long.parseLong(parts[2])));
                    break;
                case "TTL":
                    if (parts.length >= 2) System.out.println(store.ttl(parts[1]));
                    break;
                case "PERSIST":
                    if (parts.length >= 2) System.out.println(store.persist(parts[1]));
                    break;
                case "PING":
                    String msg = parts.length > 1 ? line.substring(4).trim() : "";
                    System.out.println(store.ping(msg));
                    break;
                case "MSET":
                    System.out.println(store.mset(Arrays.copyOfRange(parts, 1, parts.length)));
                    break;
                case "MGET":
                    System.out.println(store.mget(Arrays.copyOfRange(parts, 1, parts.length)));
                    break;
                case "COMPACT":
                    System.out.println(store.compact());
                    break;
                case "MEMSTATS":
                    System.out.println(store.memstats());
                    break;
                case "EXIT":
                    return;
            }
            System.out.flush();
        }
    }
}
`,
};
