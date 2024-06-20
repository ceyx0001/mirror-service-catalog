"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modsRelations = exports.mods = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const itemsSchema_1 = require("./itemsSchema");
exports.mods = (0, pg_core_1.pgTable)("mods", {
    mod: (0, pg_core_1.text)("mod"),
    type: (0, pg_core_1.text)("type"),
    dupes: (0, pg_core_1.integer)("dupes"),
    item_id: (0, pg_core_1.text)("item_id").references(() => itemsSchema_1.items.item_id),
}, (table) => ({
    pk: (0, pg_core_1.primaryKey)({ columns: [table.mod, table.type, table.item_id] }),
}));
exports.modsRelations = (0, drizzle_orm_1.relations)(exports.mods, ({ one }) => ({
    item: one(itemsSchema_1.items, {
        fields: [exports.mods.item_id],
        references: [itemsSchema_1.items.item_id],
    }),
}));
