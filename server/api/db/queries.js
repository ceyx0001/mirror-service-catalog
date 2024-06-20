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
exports.updateCatalog = updateCatalog;
exports.getThreadsInRange = getThreadsInRange;
exports.getAllThreads = getAllThreads;
exports.getShopsInRange = getShopsInRange;
exports.getFilteredItems = getFilteredItems;
const app_1 = require("../app");
const catalogSchema_1 = require("./schemas/catalogSchema");
const itemsSchema_1 = require("./schemas/itemsSchema");
const modsSchema_1 = require("./schemas/modsSchema");
const drizzle_orm_1 = require("drizzle-orm");
const search_1 = require("./searches/search");
function buildConflictUpdateSet(table) {
    const columns = Object.keys(table);
    return columns.reduce((acc, column) => {
        acc[column] = drizzle_orm_1.sql.raw(`excluded.${column}`);
        return acc;
    }, {});
}
function setMods(map, itemId, modType, mods) {
    if (mods) {
        for (const text of mods) {
            const key = itemId + modType + text;
            if (map.get(key)) {
                const oldMod = map.get(key);
                oldMod.dupes += 1;
                map.set(key, oldMod);
            }
            else {
                map.set(key, {
                    item_id: itemId,
                    mod: text,
                    type: modType,
                    dupes: null,
                });
            }
        }
    }
}
function aggregateMods(item, map) {
    for (const key in item) {
        if (item[key]) {
            switch (key) {
                case "enchantMods":
                    setMods(map, item.id, "enchant", item[key]);
                    break;
                case "implicitMods":
                    setMods(map, item.id, "implicit", item[key]);
                    break;
                case "explicitMods":
                    setMods(map, item.id, "explicit", item[key]);
                    break;
                case "fracturedMods":
                    setMods(map, item.id, "fractured", item[key]);
                    break;
                case "craftedMods":
                    setMods(map, item.id, "crafted", item[key]);
                    break;
                case "crucibleMods":
                    setMods(map, item.id, "crucible", item[key]);
                    break;
                default:
            }
        }
    }
}
function updateCatalog(shops) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemsToInsert = new Map();
        const modsToInsert = new Map();
        try {
            const shopsToInsert = shops.map((shop) => {
                shop.items.forEach((item) => {
                    if (!itemsToInsert.has(item.id)) {
                        const db_item = {
                            name: item.name,
                            base_type: item.baseType,
                            icon: item.icon,
                            quality: item.quality,
                            item_id: item.id,
                            shop_id: shop.thread_index,
                        };
                        itemsToInsert.set(item.id, db_item);
                        aggregateMods(item, modsToInsert);
                    }
                });
                return {
                    profile_name: shop.profile_name,
                    thread_index: shop.thread_index,
                    views: shop.views,
                    title: shop.title,
                };
            });
            const shopsPromise = app_1.db
                .insert(catalogSchema_1.catalog)
                .values(shopsToInsert)
                .onConflictDoUpdate({
                target: catalogSchema_1.catalog.profile_name,
                set: buildConflictUpdateSet(catalogSchema_1.catalog),
            });
            const uniqueItemsToInsert = Array.from(itemsToInsert.values());
            const itemsPromise = app_1.db
                .insert(itemsSchema_1.items)
                .values(uniqueItemsToInsert)
                .onConflictDoUpdate({
                target: itemsSchema_1.items.item_id,
                set: buildConflictUpdateSet(itemsSchema_1.items),
            });
            const uniqueModsToInsert = Array.from(modsToInsert.values());
            const itemIds = uniqueModsToInsert.map((mod) => mod.item_id);
            yield app_1.db.delete(modsSchema_1.mods).where((0, drizzle_orm_1.inArray)(modsSchema_1.mods.item_id, itemIds));
            const modsPromise = app_1.db
                .insert(modsSchema_1.mods)
                .values(uniqueModsToInsert)
                .onConflictDoNothing();
            yield Promise.all([shopsPromise, itemsPromise, modsPromise]);
        }
        catch (error) {
            console.log(error);
        }
    });
}
function getThreadsInRange(offset, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield app_1.db
            .select({
            profileName: catalogSchema_1.catalog.profile_name,
            threadIndex: catalogSchema_1.catalog.thread_index,
            title: catalogSchema_1.catalog.title,
        })
            .from(catalogSchema_1.catalog)
            .orderBy((0, drizzle_orm_1.desc)(catalogSchema_1.catalog.views))
            .offset(offset)
            .limit(limit);
    });
}
function getAllThreads() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield app_1.db.select().from(catalogSchema_1.catalog);
    });
}
function getShopsInRange(offset, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield app_1.db.query.catalog.findMany({
                columns: { views: false },
                with: {
                    items: {
                        columns: { shop_id: false },
                        with: {
                            mods: { columns: { item_id: false } },
                        },
                    },
                },
                offset: offset,
                limit: limit,
            });
            for (const shop of result) {
                for (const item of shop.items) {
                    item.mods = (0, search_1.groupMods)(item.mods);
                }
            }
            return result;
        }
        catch (error) {
            console.log(error);
        }
    });
}
function getFilteredItems(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, search_1.filterItems)(filters);
    });
}
