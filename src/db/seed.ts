import { db } from "./index";
import {
  users,
  challenges,
  challengeVersions,
  challengeFiles,
  benchmarkConfigs,
} from "./schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export function hashPassword(password: string): string {
  const salt = "algo_dev_salt_2026";
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

async function seed() {
  console.log("🌱 Seeding ALGO database...");

  // 1. Seed Users
  const adminPasswordHash = hashPassword("Admin123!algo");
  const studentPasswordHash = hashPassword("Student123!algo");

  const [adminUser] = await db
    .insert(users)
    .values({
      name: "ALGO Administrator",
      username: "admin",
      email: "admin@algo.local",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        role: "ADMIN",
        passwordHash: adminPasswordHash,
      },
    })
    .returning();

  const [studentUser] = await db
    .insert(users)
    .values({
      name: "Curious Engineer",
      username: "engineer",
      email: "student@algo.local",
      role: "STUDENT",
      passwordHash: studentPasswordHash,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        role: "STUDENT",
        passwordHash: studentPasswordHash,
      },
    })
    .returning();

  console.log(`✓ Admin user: ${adminUser.email} (role: ${adminUser.role})`);
  console.log(`✓ Student user: ${studentUser.email} (role: ${studentUser.role})`);

  // 2. Seed Challenge: Key-Value Store
  const challengeSlug = "kv-store";
  const existingChallenge = await db
    .select()
    .from(challenges)
    .where(eq(challenges.slug, challengeSlug))
    .limit(1);

  let challengeId = existingChallenge[0]?.id;

  if (!existingChallenge[0]) {
    const [createdChallenge] = await db
      .insert(challenges)
      .values({
        slug: challengeSlug,
        title: "Build a Key-Value Store",
        tagline: "Understand Redis from first principles. Build, measure, and optimize.",
        description: `Reconstruct a high-performance in-memory key-value store inspired by Redis.
Build the foundational data structures, implement durable persistence, and optimize throughput and latency against rigorous automated benchmarks.`,
        difficulty: "INTERMEDIATE",
        status: "PUBLISHED",
        supportedLanguages: ["python", "cpp"],
        currentVersionNumber: 1,
      })
      .returning();
    challengeId = createdChallenge.id;
  }

  // Challenge Version 1
  const spec = {
    overview: `Reconstruct a key-value store from first principles.
In this challenge, you will implement an in-memory data engine capable of handling core commands, persistent logging, and fast lookups under heavy simulated load.`,
    whatYouLearn: [
      "Low-overhead hash table architecture and collision resolution",
      "Write-ahead logging (WAL) and durable crash recovery",
      "Memory layout optimization and cache-line locality",
      "Latency percentiles (p50, p95, p99) under adversarial throughput",
    ],
    apiSpecification: [
      { command: "SET key value", returns: "OK", description: "Stores value at key." },
      { command: "GET key", returns: "value | NULL", description: "Retrieves value at key or NULL if missing." },
      { command: "DELETE key", returns: "OK | NOT_FOUND", description: "Removes key from store." },
      { command: "EXISTS key", returns: "TRUE | FALSE", description: "Checks if key exists." },
    ],
    levels: [
      {
        level: 1,
        title: "Basic In-Memory Store",
        description: "Implement fundamental SET, GET, DELETE, and EXISTS operations with 100% correctness.",
        requirements: "Support basic key-value semantics with arbitrary string keys and values.",
      },
      {
        level: 2,
        title: "Efficient Lookup",
        description: "Implement an optimized hash table with custom hashing and collision resolution. Target O(1) lookups.",
        requirements: "Handle dynamic resizing, uniform distribution, and load factor thresholding.",
      },
      {
        level: 3,
        title: "Durable Persistence",
        description: "Implement an append-only write-ahead log (WAL) and restart snapshot recovery.",
        requirements: "All mutations must survive process restarts and recover to consistent state.",
      },
      {
        level: 4,
        title: "TTL & Key Expiration",
        description: "Support EXPIRE key seconds. Clean up expired keys using passive and active expiration loops.",
        requirements: "Architected for future release.",
      },
      {
        level: 5,
        title: "Concurrency & Lock-Free Reads",
        description: "Scale across multiple CPU threads using striped locking or lock-free data structures.",
        requirements: "Architected for future release.",
      },
      {
        level: 6,
        title: "Extreme Optimization",
        description: "Push hardware limits. Optimize cache lines, minimize memory allocations, and maximize ops/sec.",
        requirements: "Architected for future release.",
      },
    ],
  };

  const starterPython = `"""
ALGO Key-Value Store Challenge
Level 1-3 Implementation
"""
import os
import sys

class KeyValueStore:
    def __init__(self, data_dir="./data"):
        self.data_dir = data_dir
        self.wal_path = os.path.join(data_dir, "wal.log")
        os.makedirs(data_dir, exist_ok=True)
        self.store = {}
        self._recover()

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

    def _log_wal(self, entry: str):
        """Append-only log entry."""
        with open(self.wal_path, "a", encoding="utf-8") as f:
            f.write(entry + "\\n")
            f.flush()

    def set(self, key: str, value: str) -> str:
        self._log_wal(f"SET {key} {value}")
        self.store[key] = value
        return "OK"

    def get(self, key: str) -> str:
        return self.store.get(key, "NULL")

    def delete(self, key: str) -> str:
        if key in self.store:
            self._log_wal(f"DEL {key}")
            del self.store[key]
            return "OK"
        return "NOT_FOUND"

    def exists(self, key: str) -> str:
        return "TRUE" if key in self.store else "FALSE"

if __name__ == "__main__":
    # Standard I/O command loop for automated testing & benchmarking
    store = KeyValueStore()
    for line in sys.stdin:
        parts = line.strip().split(" ", 2)
        if not parts or not parts[0]:
            continue
        cmd = parts[0].upper()
        if cmd == "SET" and len(parts) == 3:
            print(store.set(parts[1], parts[2]))
        elif cmd == "GET" and len(parts) >= 2:
            print(store.get(parts[1]))
        elif cmd == "DELETE" and len(parts) >= 2:
            print(store.delete(parts[1]))
        elif cmd == "EXISTS" and len(parts) >= 2:
            print(store.exists(parts[1]))
        elif cmd == "EXIT":
            break
        sys.stdout.flush()
`;

  const starterCpp = `/**
 * ALGO Key-Value Store Challenge
 * Level 1-3 Implementation (C++)
 */
#include <iostream>
#include <string>
#include <unordered_map>
#include <fstream>
#include <sstream>

class KeyValueStore {
private:
    std::unordered_map<std::string, std::string> store;
    std::string wal_path = "./data/wal.log";

    void recover() {
        std::ifstream wal(wal_path);
        if (!wal.is_open()) return;
        std::string line;
        while (std::getline(wal, line)) {
            std::istringstream iss(line);
            std::string cmd, key, val;
            iss >> cmd >> key;
            if (cmd == "SET") {
                std::getline(iss >> std::ws, val);
                store[key] = val;
            } else if (cmd == "DEL") {
                store.erase(key);
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

    std::string set(const std::string& key, const std::string& val) {
        logWal("SET " + key + " " + val);
        store[key] = val;
        return "OK";
    }

    std::string get(const std::string& key) {
        auto it = store.find(key);
        if (it != store.end()) return it->second;
        return "NULL";
    }

    std::string del(const std::string& key) {
        if (store.erase(key)) {
            logWal("DEL " + key);
            return "OK";
        }
        return "NOT_FOUND";
    }

    std::string exists(const std::string& key) {
        return (store.find(key) != store.end()) ? "TRUE" : "FALSE";
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
        std::string cmd, key, val;
        iss >> cmd >> key;
        if (cmd == "SET") {
            std::getline(iss >> std::ws, val);
            std::cout << store.set(key, val) << "\\n";
        } else if (cmd == "GET") {
            std::cout << store.get(key) << "\\n";
        } else if (cmd == "DELETE") {
            std::cout << store.del(key) << "\\n";
        } else if (cmd == "EXISTS") {
            std::cout << store.exists(key) << "\\n";
        } else if (cmd == "EXIT") {
            break;
        }
        std::cout << std::flush;
    }
    return 0;
}
`;

  const [version] = await db
    .insert(challengeVersions)
    .values({
      challengeId: challengeId!,
      version: 1,
      spec,
      levels: spec.levels,
      starterTemplates: {
        python: starterPython,
        cpp: starterCpp,
      },
      testDefinitions: {
        correctnessSuites: [
          { name: "test_basic_crud", weight: 30, description: "Validates SET, GET, DELETE, and EXISTS" },
          { name: "test_lookup_collisions", weight: 30, description: "10,000 keys with high collision risk" },
          { name: "test_persistence_recovery", weight: 40, description: "Simulates restart and validates recovered data" },
        ],
      },
      createdBy: adminUser.id,
    })
    .returning();

  // 3. Seed Benchmark Config
  const baselineThroughput = 100000.0; // 100,000 ops/sec baseline

  await db.insert(benchmarkConfigs).values({
    challengeVersionId: version.id,
    version: 1,
    workloads: [
      { name: "sequential_set", count: 100000, description: "100K sequential SETs" },
      { name: "sequential_get", count: 100000, description: "100K sequential GETs" },
      { name: "mixed_operations", count: 100000, description: "70% GET, 20% SET, 10% DELETE" },
      { name: "large_payloads", count: 10000, description: "10K SETs with 1KB payloads" },
    ],
    iterations: 5,
    warmupIterations: 2,
    timeoutSeconds: 60,
    cpuLimit: "1.00",
    memoryLimitMb: 256,
    baselineMetrics: {
      throughputOpsSec: baselineThroughput,
      latencyP50Ms: 0.08,
      latencyP95Ms: 0.25,
      latencyP99Ms: 0.52,
      memoryBytes: 32 * 1024 * 1024, // 32MB
    },
    isActive: true,
  });

  console.log("✓ Key-Value Store challenge seeded with v1 spec, starter templates, and benchmark configs.");
  console.log("🌱 Database seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
