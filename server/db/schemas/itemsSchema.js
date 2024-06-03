import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { catalog } from "./catalogSchema.js";
import { mods } from "./modsSchema.js";

export const items = pgTable("items", {
  item_id: text("item_id", { length: 256 }).primaryKey().notNull(),
  icon: text("icon", { length: 256 }),
  name: text("name", { length: 100 }),
  base_type: text("base_type", { length: 50 }),
  quality: integer("quality", { length: 4 }),
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
