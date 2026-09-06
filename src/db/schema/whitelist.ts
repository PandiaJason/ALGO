import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const whitelistUsers = pgTable("whitelist_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  notes: text("notes"),
  addedBy: uuid("added_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export type WhitelistUser = typeof whitelistUsers.$inferSelect;
export type NewWhitelistUser = typeof whitelistUsers.$inferInsert;
