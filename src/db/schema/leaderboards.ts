import {
  pgTable,
  uuid,
  decimal,
  bigint,
  integer,
  boolean,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { challenges } from "./challenges";
import { submissions } from "./submissions";

export const leaderboardEntries = pgTable(
  "leaderboard_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    score: decimal("score", { precision: 10, scale: 4 }).notNull(),
    throughputOpsSec: decimal("throughput_ops_sec", { precision: 12, scale: 2 }).notNull(),
    latencyP99Ms: decimal("latency_p99_ms", { precision: 10, scale: 4 }),
    memoryBytes: bigint("memory_bytes", { mode: "number" }),
    rank: integer("rank").default(0).notNull(),
    isVerified: boolean("is_verified").default(true).notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueChallengeUser: unique("uq_leaderboard_challenge_user").on(
      table.challengeId,
      table.userId
    ),
  })
);

export const userChallengeProgress = pgTable(
  "user_challenge_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    challengeId: uuid("challenge_id")
      .notNull()
      .references(() => challenges.id, { onDelete: "cascade" }),
    highestLevelUnlocked: integer("highest_level_unlocked").default(1).notNull(),
    bestScore: decimal("best_score", { precision: 10, scale: 4 }).default("0.0000").notNull(),
    bestSubmissionId: uuid("best_submission_id").references(() => submissions.id),
    isCompleted: boolean("is_completed").default(false).notNull(),
    submissionCount: integer("submission_count").default(0).notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    uniqueUserChallenge: unique("uq_progress_user_challenge").on(
      table.userId,
      table.challengeId
    ),
  })
);

export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
