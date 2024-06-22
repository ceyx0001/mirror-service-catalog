"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getItems = getItems;
const itemsSchema_1 = require("../../schemas/itemsSchema");
const db_1 = __importDefault(require("../../db"));
const search_1 = require("../search");
const drizzle_orm_1 = require("drizzle-orm");
const andStrategy = __importStar(require("./andStrategies"));
function getItems(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let filtersArray = [
                { filter: filters.titleFilters, strategy: andStrategy.andTitleFilter },
                { filter: filters.baseFilters, strategy: andStrategy.andBaseFilter },
                { filter: filters.modFilters, strategy: andStrategy.andModFilter },
            ];
            let filteredTable;
            for (let filterObj of filtersArray) {
                filteredTable = yield filterObj.strategy.apply(filterObj.filter, filteredTable);
            }
            if (filteredTable && filteredTable.length > 0) {
                const itemIdSet = new Set();
                filteredTable.map((mod) => itemIdSet.add(mod.item_id));
                const itemIds = Array.from(itemIdSet);
                const result = yield db_1.default.query.items.findMany({
                    where: (0, drizzle_orm_1.inArray)(itemsSchema_1.items.item_id, itemIds),
                    columns: { shop_id: false },
                    with: {
                        mods: { columns: { item_id: false } },
                        catalog: { columns: { views: false } },
                    },
                });
                return Array.from((0, search_1.mapItemsToShop)(result));
            }
            return [];
        }
        catch (error) {
            console.error(error);
        }
    });
}
