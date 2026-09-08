import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { runQuickTest, runInSandbox } from "../src/lib/sandbox/runner";
import { isLimaAvailable } from "../src/lib/sandbox/lima-nsjail";

async function main() {
  console.log("=== ALGO SANDBOX ENGINE VERIFICATION ===");
  console.log(`Backend setting: ${process.env.SANDBOX_BACKEND}`);
  console.log(`Lima VM active: ${isLimaAvailable()}`);

  if (!isLimaAvailable()) {
    console.error("❌ Lima VM is not active! Start it with: limactl start algo-runner");
    process.exit(1);
  }

  // --- 1. Python KV Store Level 1 ---
  console.log("\n🧪 [Test 1] Running Python Level 1 Test Suite...");
  const pythonCode = `
import sys

store = {}

for line in sys.stdin:
    parts = line.strip().split()
    if not parts:
        continue
    cmd = parts[0].upper()
    if cmd == "SET":
        store[parts[1]] = parts[2]
        print("OK")
    elif cmd == "GET":
        print(store.get(parts[1], "NULL"))
    elif cmd == "EXISTS":
        print("TRUE" if parts[1] in store else "FALSE")
    elif cmd == "DELETE":
        if parts[1] in store:
            del store[parts[1]]
        print("OK")
`;

  const t0 = performance.now();
  const pyResult = await runQuickTest("python", pythonCode, 1, "kv-store");
  const pyDuration = Math.round(performance.now() - t0);

  console.log(`   Python Result: ${pyResult.passed}/${pyResult.total} passed in ${pyDuration}ms`);
  console.log(pyResult.details);

  if (pyResult.passed !== pyResult.total) {
    console.error("❌ Python test suite failed!");
    process.exit(1);
  }
  console.log("   ✅ Python test suite passed successfully!");

  // --- 2. C++ KV Store Level 1 ---
  console.log("\n🧪 [Test 2] Running C++ Level 1 Test Suite...");
  const cppCode = `
#include <iostream>
#include <string>
#include <unordered_map>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    unordered_map<string, string> store;
    string cmd;

    while (cin >> cmd) {
        if (cmd == "SET") {
            string k, v;
            cin >> k >> v;
            store[k] = v;
            cout << "OK\\n";
        } else if (cmd == "GET") {
            string k;
            cin >> k;
            auto it = store.find(k);
            if (it != store.end()) cout << it->second << "\\n";
            else cout << "NULL\\n";
        } else if (cmd == "EXISTS") {
            string k;
            cin >> k;
            if (store.find(k) != store.end()) cout << "TRUE\\n";
            else cout << "FALSE\\n";
        } else if (cmd == "DELETE") {
            string k;
            cin >> k;
            store.erase(k);
            cout << "OK\\n";
        }
    }
    return 0;
}
`;

  const t1 = performance.now();
  const cppResult = await runQuickTest("cpp", cppCode, 1, "kv-store");
  const cppDuration = Math.round(performance.now() - t1);

  console.log(`   C++ Result: ${cppResult.passed}/${cppResult.total} passed in ${cppDuration}ms`);
  console.log(cppResult.details);

  if (cppResult.passed !== cppResult.total) {
    console.error("❌ C++ test suite failed!");
    process.exit(1);
  }
  console.log("   ✅ C++ test suite passed successfully!");

  // --- 3. Timeout Enforcement Test ---
  console.log("\n🧪 [Test 3] Testing Infinite Loop Timeout Guard...");
  const infiniteLoopPy = "while True:\n    pass\n";
  const timeoutT0 = performance.now();
  const timeoutRes = await runInSandbox(infiniteLoopPy, "python", "", 2000);
  const timeoutDuration = Math.round(performance.now() - timeoutT0);

  console.log(`   Timeout Result: timedOut=${timeoutRes.timedOut}, exitCode=${timeoutRes.exitCode} in ${timeoutDuration}ms`);
  if (!timeoutRes.timedOut && timeoutRes.exitCode !== 124 && timeoutRes.exitCode !== 137) {
    console.error("❌ Timeout guard failed!");
    process.exit(1);
  }
  console.log("   ✅ Timeout correctly caught and terminated!");

  console.log("\n🎉 ALL SANDBOX VERIFICATION TESTS PASSED VIA LIMA DEBIAN + NSJAIL!");
  console.log(`⚡ Speed Summary: 5 Python tests in ${pyDuration}ms, 5 C++ tests in ${cppDuration}ms.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
