import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { catalog } from "./catalogSchema";
import { mods } from "./modsSchema";

export const items = pgTable("items", {
  itemId: text("itemId").primaryKey().notNull(),
  icon: text("icon"),
  name: text("name"),
  baseType: text("baseType"),
  quality: text("quality"),
  shopId: integer("shopId")
    .notNull()
    .references(() => catalog.threadIndex, { onUpdate: "cascade" }),
});

export const itemsRelations = relations(items, ({ one, many }) => ({
  catalog: one(catalog, {
    fields: [items.shopId],
    references: [catalog.threadIndex],
  }),
  mods: many(mods),
}));

export type SelectItem = InferSelectModel<typeof items>;