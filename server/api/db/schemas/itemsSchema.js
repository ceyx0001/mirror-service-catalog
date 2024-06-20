"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsRelations = exports.items = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const catalogSchema_1 = require("./catalogSchema");
const modsSchema_1 = require("./modsSchema");
exports.items = (0, pg_core_1.pgTable)("items", {
    item_id: (0, pg_core_1.text)("item_id").primaryKey().notNull(),
    icon: (0, pg_core_1.text)("icon"),
    name: (0, pg_core_1.text)("name"),
    base_type: (0, pg_core_1.text)("base_type"),
    quality: (0, pg_core_1.text)("quality"),
    shop_id: (0, pg_core_1.integer)("shop_id")
        .notNull()
        .references(() => catalogSchema_1.catalog.thread_index, { onUpdate: "cascade" }),
});
exports.itemsRelations = (0, drizzle_orm_1.relations)(exports.items, ({ one, many }) => ({
    catalog: one(catalogSchema_1.catalog, {
        fields: [exports.items.shop_id],
        references: [catalogSchema_1.catalog.thread_index],
    }),
    mods: many(modsSchema_1.mods),
}));
