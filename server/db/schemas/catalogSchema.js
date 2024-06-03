import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { items } from "./itemsSchema.js";

export const catalog = pgTable("catalog", {
  profile_name: text("profile_name", { length: 100 }).notNull().primaryKey(),
  thread_index: integer("thread_index", { length: 50 }).unique(),
  views: integer("views"),
  title: text("title", { length: 100 }),
});

export const catalogRelations = relations(catalog, ({ many }) => ({
  items: many(items),
}));
