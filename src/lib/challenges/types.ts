// src/lib/challenges/types.ts

export interface ArchitecturalLayer {
  number: number;
  name: string;
  focus: string;
  description: string;
  realWorldTech: string;
}

export interface LevelLearningLoop {
  bottleneck: string;
  whatYouUnderstand: string[];
  productionParity: string;
  outcomeSummary: string;
}

export interface LevelDefinition {
  level: number;
  shortTitle: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tagline: string;
  learningLoop: LevelLearningLoop;
  operations: Array<{ cmd: string; desc: string }>;
  durabilityRules?: string[];
  examples: Array<{ title: string; input: string; output: string }>;
  constraints: string[];
  cases: Array<{
    name: string;
    input: string;
    expected: string;
    check?: (actual: string, expected: string) => boolean;
  }>;
}

export type SupportedLanguage = "python" | "cpp" | "rust" | "go" | "java";

export interface ChallengeData {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  domain: "SYSTEMS" | "PERFORMANCE" | "DISTRIBUTED_SYSTEMS" | "SEARCH_DATA";
  inspiredBy: string;
  whatStudentsBuild: string;
  mainSkill: string;
  signatureQuestion: string;
  overview: string;
  whyItMatters: string;
  finalOutcome: string;
  architecturalLayers: ArchitecturalLayer[];
  levels: Record<number, LevelDefinition>;
  starterTemplates: {
    python: string;
    cpp: string;
    rust?: string;
    go?: string;
    java?: string;
  };
}
