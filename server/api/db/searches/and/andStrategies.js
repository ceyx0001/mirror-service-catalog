"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.andModFilter = exports.andBaseFilter = exports.andTitleFilter = void 0;
const app_1 = require("../../../app");
const drizzle_orm_1 = require("drizzle-orm");
const catalogSchema_1 = require("../../schemas/catalogSchema");
const itemsSchema_1 = require("../../schemas/itemsSchema");
const modsSchema_1 = require("../../schemas/modsSchema");
function applyFilters(filters, parentTable, key, parentTableName, columns) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result = null;
            if (filters.length > 0) {
                const conditions = columns.map((column) => (0, drizzle_orm_1.sql) `${drizzle_orm_1.sql.raw(column)} ILIKE ${drizzle_orm_1.sql.placeholder("filter")}`);
                const combinedConditions = drizzle_orm_1.sql.join(conditions, (0, drizzle_orm_1.sql) ` OR `);
                const preparedQuery = (table) => app_1.db
                    .select()
                    .from(table)
                    .where((0, drizzle_orm_1.sql) `${table[key]} IN (SELECT ${drizzle_orm_1.sql.raw(key)} FROM ${drizzle_orm_1.sql.raw(parentTableName)} WHERE ${combinedConditions})`)
                    .prepare();
                let filteredTable = yield preparedQuery(parentTable).execute({
                    filter: `%${filters.pop()}%`,
                });
                while (filters.length > 0) {
                    const next = yield preparedQuery(filteredTable).execute({
                        filter: `%${filters.pop()}%`,
                    });
                    if (!next) {
                        throw new Error("Subsequent query returned no results.");
                    }
                    filteredTable = next;
                }
                result = filteredTable;
            }
            return result;
        }
        catch (error) {
            return error;
        }
    });
}
exports.andTitleFilter = {
    apply: (filter_1, ...args_1) => __awaiter(void 0, [filter_1, ...args_1], void 0, function* (filter, table = catalogSchema_1.catalog) {
        if (!filter) {
            return null;
        }
        return yield applyFilters(filter, table, "thread_index", "catalog", [
            "title",
        ]);
    }),
};
exports.andBaseFilter = {
    apply: (filter, table) => __awaiter(void 0, void 0, void 0, function* () {
        let filteredBase;
        if (table && table.length > 0) {
            const threadIndexes = table.map((shop) => shop.thread_index);
            filteredBase = yield app_1.db
                .select()
                .from(itemsSchema_1.items)
                .where((0, drizzle_orm_1.inArray)(itemsSchema_1.items.shop_id, threadIndexes))
                .as("filteredBase");
        }
        else {
            filteredBase = itemsSchema_1.items;
        }
        if (!filter) {
            return yield app_1.db.select().from(filteredBase);
        }
        return yield applyFilters(filter, filteredBase, "item_id", "items", [
            "base_type",
            "name",
            "quality",
        ]);
    }),
};
exports.andModFilter = {
    apply: (filter, table) => __awaiter(void 0, void 0, void 0, function* () {
        let filteredMods;
        if (table && table.length > 0) {
            const itemIds = table.map((item) => item.item_id);
            filteredMods = yield app_1.db
                .select()
                .from(modsSchema_1.mods)
                .where((0, drizzle_orm_1.inArray)(modsSchema_1.mods.item_id, itemIds))
                .as("filteredMods");
        }
        else {
            filteredMods = modsSchema_1.mods;
        }
        if (!filter) {
            return yield app_1.db.select().from(filteredMods);
        }
        return yield applyFilters(filter, filteredMods, "item_id", "mods", ["mod"]);
    }),
};
