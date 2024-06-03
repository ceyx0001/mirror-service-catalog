import { pgTable, text, integer, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { items } from "./itemsSchema.js";

export const mods = pgTable(
  "mods",
  {
    mod: text("mod"),
    type: text("type"),
    dupes: integer("dupes"),
    item_id: text("item_id").references(() => items.item_id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.mod, table.type, table.item_id] }),
  })
);

export const modsRelations = relations(mods, ({ one }) => ({
  item: one(items, {
    fields: [mods.item_id],
    references: [items.item_id],
  }),
}));
