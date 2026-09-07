// src/lib/challenges/kv-store.ts
import { ChallengeData } from "./types";
import { PROJECT_SCOPE, LEVEL_DEFINITIONS } from "../constants/challenge-data";
import { DEFAULT_STARTER_TEMPLATES } from "../constants/templates";

export const kvStoreChallenge: ChallengeData = {
  slug: "kv-store",
  number: "01",
  title: "Build a Key-Value Engine",
  subtitle: PROJECT_SCOPE.subtitle,
  badge: PROJECT_SCOPE.badge,
  domain: "SYSTEMS",
  inspiredBy: "Redis",
  whatStudentsBuild: "In-memory storage engine",
  mainSkill: "Data structures, hashing, persistence",
  signatureQuestion: "Can you make your storage engine faster?",
  overview: PROJECT_SCOPE.overview,
  whyItMatters: PROJECT_SCOPE.whyItMatters,
  finalOutcome: PROJECT_SCOPE.finalOutcome,
  philosophy: PROJECT_SCOPE.philosophy,
  architectureDiagram: PROJECT_SCOPE.architectureDiagram,
  levelRoadmap: PROJECT_SCOPE.levelRoadmap,
  architecturalLayers: PROJECT_SCOPE.architecturalLayers,
  levels: LEVEL_DEFINITIONS,
  starterTemplates: DEFAULT_STARTER_TEMPLATES,
};
