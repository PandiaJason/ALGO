import { pgTable, uuid, varchar, text, timestamp, pgEnum, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";

export const challengeDifficultyEnum = pgEnum("challenge_difficulty", [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
]);

export const challengeStatusEnum = pgEnum("challenge_status", [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

export const challenges = pgTable("challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  tagline: varchar("tagline", { length: 255 }),
  description: text("description").notNull(),
  difficulty: challengeDifficultyEnum("difficulty").default("INTERMEDIATE").notNull(),
  status: challengeStatusEnum("status").default("DRAFT").notNull(),
  supportedLanguages: jsonb("supported_languages").$type<string[]>().default(["python", "cpp"]).notNull(),
  currentVersionNumber: integer("current_version_number").default(1).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const challengeVersions = pgTable("challenge_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  challengeId: uuid("challenge_id")
    .notNull()
    .references(() => challenges.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  spec: jsonb("spec").notNull(), // Full markdown / structured spec
  levels: jsonb("levels").notNull(), // Array of levels: { level: 1, title, description, tasks }
  starterTemplates: jsonb("starter_templates").notNull(), // Starter files per language
  testDefinitions: jsonb("test_definitions").notNull(), // Test metadata
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const challengeFiles = pgTable("challenge_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  challengeVersionId: uuid("challenge_version_id")
    .notNull()
    .references(() => challengeVersions.id, { onDelete: "cascade" }),
  filename: varchar("filename", { length: 255 }).notNull(),
  language: varchar("language", { length: 32 }).notNull(),
  content: text("content").notNull(),
  isReadonly: boolean("is_readonly").default(false).notNull(),
  isHidden: boolean("is_hidden").default(false).notNull(), // Hidden test harnesses
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export type Challenge = typeof challenges.$inferSelect;
export type ChallengeVersion = typeof challengeVersions.$inferSelect;
