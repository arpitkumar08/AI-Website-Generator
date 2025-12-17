import {
  integer,
  pgTable,
  timestamp,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

/* ================= USERS ================= */

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(2),
});

/* ================= PROJECTS ================= */

export const projectTable = pgTable("projects", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  projectId: varchar({ length: 255 }).notNull().unique(),
  createdBy: varchar({ length: 255 }).references(() => usersTable.email),
  createdOn: timestamp().defaultNow(),
});

/* ================= FRAMES ================= */

export const frameTable = pgTable("frames", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  frameId: varchar({ length: 255 }).notNull(),
  projectId: varchar({ length: 255 }).references(
    () => projectTable.projectId
  ),
  createdOn: timestamp().defaultNow(),
});

/* ================= CHATS ================= */

export const chatTable = pgTable("chats", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  chatMessage: jsonb().notNull(),
  createdBy: varchar({ length: 255 }).references(() => usersTable.email),
  createdOn: timestamp().defaultNow(),
});
