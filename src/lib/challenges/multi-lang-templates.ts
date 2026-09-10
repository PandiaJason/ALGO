/**
 * Multi-Language Starter Template Provider for ALGO
 * Provides authentic, idiomatic starter templates for Rust 1.75+, Go 1.22+, and Java 21
 * alongside existing Python 3.12 and C++20 implementations.
 */

import { SupportedLanguage } from "./types";
import { DEFAULT_STARTER_TEMPLATES } from "../constants/templates";
import { getChallenge } from "./index";

export function getChallengeStarterCode(
  slug: string,
  lang: SupportedLanguage,
  challengeTitle?: string
): string {
  // If KV store, use the comprehensive 6-level templates
  if (slug === "kv-store" && (DEFAULT_STARTER_TEMPLATES as any)[lang]) {
    return (DEFAULT_STARTER_TEMPLATES as any)[lang];
  }

  const chData = getChallenge(slug);
  const title = challengeTitle || chData?.title || "Systems Engine";

  // Check if challenge explicitly defines this template
  if ((chData?.starterTemplates as any)?.[lang]) {
    return (chData?.starterTemplates as any)[lang];
  }

  // Generate idiomatic starter templates for Rust, Go, and Java
  switch (lang) {
    case "rust":
      return generateRustStarter(slug, title, chData);
    case "go":
      return generateGoStarter(slug, title, chData);
    case "java":
      return generateJavaStarter(slug, title, chData);
    case "cpp":
      return generateCppStarter(slug, title, chData);
    case "python":
    default:
      return generatePythonStarter(slug, title, chData);
  }
}

function generateRustStarter(slug: string, title: string, chData: any): string {
  const ops = chData?.levels?.[1]?.operations || [];

  return `// ALGO Challenge: ${title}
// Language: Rust 1.75+ (POSIX Stream Protocol)
// Supporting Levels 1 - 6

use std::io::{self, BufRead};

fn main() {
    let stdin = io::stdin();
    let mut reader = stdin.lock();
    let mut line = String::new();

    while reader.read_line(&mut line).unwrap_or(0) > 0 {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            line.clear();
            continue;
        }

        let parts: Vec<&str> = trimmed.split_whitespace().collect();
        let cmd = parts[0];

        match cmd {
            "PING" => println!("PONG"),
            "EXIT" | "exit" => {
                println!("OK");
                break;
            }
            ${ops.map((op: any) => {
              const opCmd = op.cmd.split(" ")[0].split("<")[0].trim();
              if (["PING", "EXIT", "exit"].includes(opCmd)) return "";
              return `"${opCmd}" => {
                // TODO: Implement ${op.desc || opCmd}
                println!("OK");
            }`;
            }).filter(Boolean).join("\n            ")}
            _ => {
                // Fallback response for unhandled protocol commands
                println!("OK");
            }
        }

        line.clear();
    }
}
`;
}

function generateGoStarter(slug: string, title: string, chData: any): string {
  const ops = chData?.levels?.[1]?.operations || [];

  return `// ALGO Challenge: ${title}
// Language: Go 1.22+ (POSIX Stream Protocol)
// Supporting Levels 1 - 6

package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	scanner := bufio.NewScanner(os.Stdin)

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}

		parts := strings.Fields(line)
		cmd := parts[0]

		switch cmd {
		case "PING":
			fmt.Println("PONG")
		case "EXIT", "exit":
			fmt.Println("OK")
			return
		${ops.map((op: any) => {
      const opCmd = op.cmd.split(" ")[0].split("<")[0].trim();
      if (["PING", "EXIT", "exit"].includes(opCmd)) return "";
      return `case "${opCmd}":
			// TODO: Implement ${op.desc || opCmd}
			fmt.Println("OK")`;
    }).filter(Boolean).join("\n		")}
		default:
			// Fallback response for unhandled protocol commands
			fmt.Println("OK")
		}
	}
}
`;
}

function generateJavaStarter(slug: string, title: string, chData: any): string {
  const ops = chData?.levels?.[1]?.operations || [];

  return `// ALGO Challenge: ${title}
// Language: Java 21 (POSIX Stream Protocol)
// Supporting Levels 1 - 6

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Solution {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        String line;

        while ((line = reader.readLine()) != null) {
            line = line.trim();
            if (line.isEmpty()) continue;

            StringTokenizer st = new StringTokenizer(line);
            String cmd = st.nextToken();

            switch (cmd) {
                case "PING":
                    System.out.println("PONG");
                    break;
                case "EXIT":
                case "exit":
                    System.out.println("OK");
                    return;
                ${ops.map((op: any) => {
                  const opCmd = op.cmd.split(" ")[0].split("<")[0].trim();
                  if (["PING", "EXIT", "exit"].includes(opCmd)) return "";
                  return `case "${opCmd}":
                    // TODO: Implement ${op.desc || opCmd}
                    System.out.println("OK");
                    break;`;
                }).filter(Boolean).join("\n                ")}
                default:
                    // Fallback response for unhandled protocol commands
                    System.out.println("OK");
                    break;
            }
        }
    }
}
`;
}

function generateCppStarter(slug: string, title: string, chData: any): string {
  return `#include <iostream>
#include <string>
#include <sstream>

int main() {
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        std::stringstream ss(line);
        std::string cmd;
        ss >> cmd;

        if (cmd == "PING") {
            std::cout << "PONG\\n";
        } else if (cmd == "exit" || cmd == "EXIT") {
            std::cout << "OK\\n";
            break;
        } else {
            std::cout << "OK\\n";
        }
    }
    return 0;
}
`;
}

function generatePythonStarter(slug: string, title: string, chData: any): string {
  return `import sys

def main():
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            cmd = parts[0]
            if cmd == "PING":
                sys.stdout.write("PONG\\n")
            elif cmd in ("EXIT", "exit"):
                sys.stdout.write("OK\\n")
                break
            else:
                sys.stdout.write("OK\\n")
            sys.stdout.flush()
        except EOFError:
            break

if __name__ == "__main__":
    main()
`;
}
