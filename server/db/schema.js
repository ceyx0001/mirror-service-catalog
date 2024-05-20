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
  icon: text("icon", { length: 256 }).notNull(),
  name: text("name", { length: 100 }).notNull().default(""),
  base_type: text("base_type", { length: 50 }).notNull().default(""),
  quality: integer("quality", { length: 4 }),
  enchant_mods: text("enchant_mods").array(),
  implicit_mods: text("implicit_mods").array(),
  explicit_mods: text("explicit_mods").array(),
  fractured_mods: text("fractured_mods").array(),
  crafted_mods: text("crafted_mods").array(),
  crucible_mods: text("crucible_mods").array(),
  owner: text("owner")
    .notNull()
    .references(() => catalog.profile_name),
});

export { catalog, items };
