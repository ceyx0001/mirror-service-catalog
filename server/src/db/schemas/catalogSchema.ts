import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { items } from "./itemsSchema";

export const catalog = pgTable("catalog", {
  profile_name: text("profile_name").notNull().primaryKey(),
  thread_index: integer("thread_index").unique(),
  views: integer("views"),
  title: text("title"),
});

export const catalogRelations = relations(catalog, ({ many }) => ({
  items: many(items),
}));

export type SelectCatalog = InferSelectModel<typeof catalog>;