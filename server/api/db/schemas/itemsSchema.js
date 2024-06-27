"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemsRelations = exports.items = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const catalogSchema_1 = require("./catalogSchema");
const modsSchema_1 = require("./modsSchema");
exports.items = (0, pg_core_1.pgTable)("items", {
    itemId: (0, pg_core_1.text)("itemId").primaryKey().notNull(),
    icon: (0, pg_core_1.text)("icon"),
    name: (0, pg_core_1.text)("name"),
    baseType: (0, pg_core_1.text)("baseType"),
    quality: (0, pg_core_1.text)("quality"),
    shopId: (0, pg_core_1.integer)("shopId")
        .notNull()
        .references(() => catalogSchema_1.catalog.threadIndex, { onUpdate: "cascade" }),
});
exports.itemsRelations = (0, drizzle_orm_1.relations)(exports.items, ({ one, many }) => ({
    catalog: one(catalogSchema_1.catalog, {
        fields: [exports.items.shopId],
        references: [catalogSchema_1.catalog.threadIndex],
    }),
    mods: many(modsSchema_1.mods),
}));
