// src/lib/challenges/types.ts

export type EngineeringStage =
  | "BUILD"
  | "CORE"
  | "HARDEN"
  | "SCALE"
  | "MEASURE"
  | "OPTIMIZE";

export interface StageDefinition {
  level: number;
  stage: EngineeringStage;
  label: string;
  question: string;
  goal: string;
}

export const UNIVERSAL_STAGES: Record<number, StageDefinition> = {
  1: {
    level: 1,
    stage: "BUILD",
    label: "Build",
    question: "Can you make it work?",
    goal: "Make it work from first principles.",
  },
  2: {
    level: 2,
    stage: "CORE",
    label: "Core",
    question: "Do you understand the core mechanism?",
    goal: "Implement internal algorithms, data structures, and fundamental mechanics.",
  },
  3: {
    level: 3,
    stage: "HARDEN",
    label: "Harden",
    question: "Does it remain correct under edge cases and failures?",
    goal: "Handle edge cases, unexpected input, and crash failure recovery.",
  },
  4: {
    level: 4,
    stage: "SCALE",
    label: "Scale",
    question: "Does it handle concurrency, workload and growth?",
    goal: "Support multi-threading, concurrency, and increasing operational load.",
  },
  5: {
    level: 5,
    stage: "MEASURE",
    label: "Measure",
    question: "Can you identify bottlenecks and prove performance?",
    goal: "Capture empirical metrics, latency percentiles, and profile bottlenecks.",
  },
  6: {
    level: 6,
    stage: "OPTIMIZE",
    label: "Optimize",
    question: "Can you make it measurably better?",
    goal: "Beat baseline performance through cache alignment, zero-copy, and compaction.",
  },
};

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
  stage?: EngineeringStage;
  shortTitle: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  tagline: string;
  diagram?: string;
  importantChallenge?: {
    title: string;
    description: string;
    codeOrFormat?: string;
  };
  endGoalDemonstration?: string;
  nextLevelTeaser?: string;
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

export interface ChallengeRoadmapStep {
  level: number;
  stage?: EngineeringStage;
  whatWeBuild: string;
  mainConcept: string;
}

export type ChallengeDomain =
  | "CORE_SYSTEMS"
  | "DISTRIBUTED_SYSTEMS"
  | "AI_SYSTEMS"
  | "SYSTEMS"
  | "PERFORMANCE"
  | "SEARCH_DATA";

export interface ChallengeData {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  domain: ChallengeDomain;
  inspiredBy: string;
  whatStudentsBuild: string;
  mainSkill: string;
  signatureQuestion: string;
  overview: string;
  whyItMatters: string;
  finalOutcome: string;
  philosophy?: string;
  architectureDiagram?: string;
  levelRoadmap?: ChallengeRoadmapStep[];
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

