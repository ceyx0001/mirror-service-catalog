import { pgTable, text, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const catalog = pgTable("catalog", {
  profile_name: text("profile_name", { length: 100 }).notNull().default(""),
  thread_index: text("thread_index", { length: 100 }).notNull().unique().default(""),
  items: jsonb("items")
    .array()
    .notNull()
    .default(sql`ARRAY[]::jsonb[]`),
  id: text("id").notNull().primaryKey(),
});

export default catalog;
