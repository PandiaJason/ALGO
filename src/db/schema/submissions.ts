import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
  decimal,
  bigint,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { challenges, challengeVersions } from "./challenges";

export const submissionStatusEnum = pgEnum("submission_status", [
  "QUEUED",
  "RUNNING",
  "TESTING",
  "BENCHMARKING",
  "COMPLETED",
  "FAILED",
  "TIMEOUT",
  "ERROR",
]);

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  challengeId: uuid("challenge_id")
    .notNull()
    .references(() => challenges.id, { onDelete: "cascade" }),
  challengeVersionId: uuid("challenge_version_id")
    .notNull()
    .references(() => challengeVersions.id),
  language: varchar("language", { length: 32 }).notNull(),
  level: integer("level").default(1).notNull(),
  status: submissionStatusEnum("status").default("QUEUED").notNull(),
  submittedAt: timestamp("submitted_at", { mode: "date" }).defaultNow().notNull(),
  startedAt: timestamp("started_at", { mode: "date" }),
  completedAt: timestamp("completed_at", { mode: "date" }),
});

export const submissionFiles = pgTable("submission_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  filename: varchar("filename", { length: 255 }).notNull(),
  content: text("content").notNull(),
});

export const submissionResults = pgTable("submission_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  submissionId: uuid("submission_id")
    .notNull()
    .unique()
    .references(() => submissions.id, { onDelete: "cascade" }),
  
  // Correctness Metrics
  correctnessPassed: integer("correctness_passed").default(0).notNull(),
  correctnessTotal: integer("correctness_total").default(0).notNull(),
  correctnessScore: decimal("correctness_score", { precision: 5, scale: 4 }).default("0.0000").notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(),

  // Benchmark Performance Metrics
  throughputOpsSec: decimal("throughput_ops_sec", { precision: 12, scale: 2 }),
  latencyP50Ms: decimal("latency_p50_ms", { precision: 10, scale: 4 }),
  latencyP95Ms: decimal("latency_p95_ms", { precision: 10, scale: 4 }),
  latencyP99Ms: decimal("latency_p99_ms", { precision: 10, scale: 4 }),
  memoryBytes: bigint("memory_bytes", { mode: "number" }),
  cpuTimeMs: decimal("cpu_time_ms", { precision: 10, scale: 2 }),
  
  // Baseline Comparison & Normalized Score
  baselineThroughput: decimal("baseline_throughput", { precision: 12, scale: 2 }),
  score: decimal("score", { precision: 10, scale: 4 }).default("0.0000").notNull(),
  improvementPct: decimal("improvement_pct", { precision: 8, scale: 4 }).default("0.0000").notNull(),

  // Administration & Invalidation
  isInvalidated: boolean("is_invalidated").default(false).notNull(),
  invalidatedBy: uuid("invalidated_by").references(() => users.id),
  invalidatedAt: timestamp("invalidated_at", { mode: "date" }),
  invalidationReason: text("invalidation_reason"),

  // Raw & Diagnostic Output
  rawMetrics: jsonb("raw_metrics"),
  testOutput: text("test_output"),
  errorOutput: text("error_output"),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type SubmissionResult = typeof submissionResults.$inferSelect;
