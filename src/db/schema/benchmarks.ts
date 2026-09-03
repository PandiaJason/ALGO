import {
  pgTable,
  uuid,
  integer,
  decimal,
  text,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { challengeVersions } from "./challenges";
import { submissions } from "./submissions";

export const benchmarkConfigs = pgTable("benchmark_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  challengeVersionId: uuid("challenge_version_id")
    .notNull()
    .references(() => challengeVersions.id, { onDelete: "cascade" }),
  version: integer("version").default(1).notNull(),
  workloads: jsonb("workloads").notNull(), // Specific test workload definitions
  iterations: integer("iterations").default(5).notNull(),
  warmupIterations: integer("warmup_iterations").default(2).notNull(),
  timeoutSeconds: integer("timeout_seconds").default(60).notNull(),
  cpuLimit: decimal("cpu_limit", { precision: 4, scale: 2 }).default("1.00").notNull(),
  memoryLimitMb: integer("memory_limit_mb").default(256).notNull(),
  baselineCode: jsonb("baseline_code"), // Baseline implementations per language
  baselineMetrics: jsonb("baseline_metrics"), // Expected baseline metrics
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const benchmarkRuns = pgTable("benchmark_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  benchmarkConfigId: uuid("benchmark_config_id")
    .notNull()
    .references(() => benchmarkConfigs.id),
  status: text("status").notNull(),
  rawMetrics: jsonb("raw_metrics").notNull(),
  startedAt: timestamp("started_at", { mode: "date" }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }),
});

export type BenchmarkConfig = typeof benchmarkConfigs.$inferSelect;
