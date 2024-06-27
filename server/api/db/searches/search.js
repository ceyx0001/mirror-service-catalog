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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupMods = groupMods;
exports.mapItemsToShop = mapItemsToShop;
exports.filterItems = filterItems;
const andSearch = __importStar(require("./and/andSearch"));
function addDupes(str, count) {
    const val = parseInt(str.split("%")[0].split().pop());
    const newVal = val * (count + 1);
    return str.replace(val, newVal);
}
function groupMods(mods) {
    const modsMap = new Map();
    for (const mod of mods) {
        const key = mod.type;
        if (mod.dupes) {
            mod.mod = addDupes(mod.mod, mod.dupes);
        }
        if (modsMap.get(key)) {
            modsMap.get(key).push(mod.mod);
        }
        else {
            modsMap.set(key, [mod.mod]);
        }
    }
    return Object.fromEntries(modsMap);
}
function mapItemsToShop(items) {
    let shopsMap = new Map();
    for (const item of items) {
        const key = item.catalog.profileName;
        const { catalog } = item, itemDetails = __rest(item, ["catalog"]);
        const modsGroup = groupMods(itemDetails.mods);
        if (shopsMap.get(key)) {
            shopsMap.get(key).items.push(Object.assign(Object.assign({}, itemDetails), { mods: modsGroup }));
        }
        else {
            shopsMap.set(key, Object.assign(Object.assign({}, catalog), { items: [Object.assign(Object.assign({}, itemDetails), { mods: modsGroup })] }));
        }
    }
    return shopsMap.values();
}
function filterItems(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let table = null;
            table = andSearch.getItems(filters);
            return table;
        }
        catch (error) {
            console.error(error);
        }
    });
}
