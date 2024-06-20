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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrMods = getOrMods;
const itemsSchema_1 = require("../schemas/itemsSchema");
const modsSchema_1 = require("../schemas/modsSchema");
const db_1 = __importDefault(require("../db"));
const search_1 = require("./search");
const drizzle_orm_1 = require("drizzle-orm");
function getOrMods(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conditions = filters.map((filter) => (0, drizzle_orm_1.ilike)(modsSchema_1.mods.mod, `%${filter}%`));
            const subQuery = db_1.default
                .select({ item_id: modsSchema_1.mods.item_id })
                .from(modsSchema_1.mods)
                .where((0, drizzle_orm_1.or)(...conditions));
            const result = yield db_1.default.query.items.findMany({
                where: (0, drizzle_orm_1.inArray)(itemsSchema_1.items.item_id, subQuery),
                columns: { shop_id: false },
                with: {
                    mods: { columns: { item_id: false } },
                    catalog: { columns: { views: false } },
                },
            });
            return Array.from((0, search_1.mapItemsToShop)(result));
        }
        catch (error) {
            return error;
        }
    });
}
