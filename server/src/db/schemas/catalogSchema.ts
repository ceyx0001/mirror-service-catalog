import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { items } from "./itemsSchema";

export const catalog = pgTable("catalog", {
  profileName: text("profileName").notNull().primaryKey(),
  threadIndex: integer("threadIndex").unique(),
  views: integer("views"),
  title: text("title"),
});

export const catalogRelations = relations(catalog, ({ many }) => ({
  items: many(items),
}));

export type SelectCatalog = InferSelectModel<typeof catalog>;