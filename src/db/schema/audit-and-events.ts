import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { challenges } from "./challenges";
import { submissions } from "./submissions";

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => users.id),
  action: varchar("action", { length: 64 }).notNull(),
  resource: varchar("resource", { length: 64 }).notNull(),
  resourceId: uuid("resource_id"),
  metadata: jsonb("metadata"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  eventType: varchar("event_type", { length: 64 }).notNull(),
  challengeId: uuid("challenge_id").references(() => challenges.id),
  submissionId: uuid("submission_id").references(() => submissions.id),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type AnalyticsEvent = typeof events.$inferSelect;
