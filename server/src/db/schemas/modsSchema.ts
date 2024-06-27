import { pgTable, text, integer, primaryKey } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { items } from "./itemsSchema";

export const mods = pgTable(
  "mods",
  {
    mod: text("mod"),
    type: text("type"),
    dupes: integer("dupes"),
    itemId: text("itemId").references(() => items.itemId),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.mod, table.type, table.itemId] }),
  })
);

export const modsRelations = relations(mods, ({ one }) => ({
  item: one(items, {
    fields: [mods.itemId],
    references: [items.itemId],
  }),
}));

export type SelectMod = InferSelectModel<typeof mods>;