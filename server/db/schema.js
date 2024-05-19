import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const catalog = pgTable("catalog", {
  profile_name: text("profile_name", { length: 100 }).notNull().primaryKey(),
  thread_index: integer("thread_index", { length: 50 })
    .notNull()
    .unique()
    .default(0),
});

const items = pgTable("items", {
  id: text("id", { length: 256 }).primaryKey().notNull(),
  name: text("name", { length: 100 }).notNull().default(""),
  base_type: text("base_type", { length: 50 }).notNull().default(""),
  enchant_mods: text("enchant_mods")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  implicit_mods: text("implicit_mods")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  explicit_mods: text("explicit_mods")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  fractured_mods: text("fractured_mods")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  crafted_mods: text("crafted_mods")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  crucible_mods: text("crucible_mods")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  shop_id: integer("shop_id")
    .notNull()
    .references(() => catalog.thread_index),
});

export { catalog, items };
