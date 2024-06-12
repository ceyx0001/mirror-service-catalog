import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { catalog } from "./catalogSchema";
import { mods } from "./modsSchema";

export const items = pgTable("items", {
  item_id: text("item_id").primaryKey().notNull(),
  icon: text("icon"),
  name: text("name"),
  base_type: text("base_type"),
  quality: integer("quality"),
  shop_id: integer("shop_id")
    .notNull()
    .references(() => catalog.thread_index, { onUpdate: "cascade" }),
});

export const itemsRelations = relations(items, ({ one, many }) => ({
  catalog: one(catalog, {
    fields: [items.shop_id],
    references: [catalog.thread_index],
  }),
  mods: many(mods),
}));
