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
exports.filteredItems = exports.shopsInRange = exports.threadsInRange = exports.allThreads = exports.catalogUpdate = void 0;
const shopController_1 = __importDefault(require("./shopController"));
const threadsController_1 = require("./threadsController");
const db = __importStar(require("../db/queries"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.catalogUpdate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startPage = parseInt(req.query.startPage, 10) || 1;
        const endPage = parseInt(req.query.endPage, 10) || 50;
        const threadReq = { query: { startPage: startPage, endPage: endPage } };
        const serviceThreads = yield (0, threadsController_1.threads)(threadReq, next);
        // Create a new request object for each thread
        const requests = serviceThreads.map((thread) => __awaiter(void 0, void 0, void 0, function* () {
            const shopData = yield (0, shopController_1.default)(thread.index);
            return Object.assign(Object.assign({}, shopData), { views: thread.views, title: thread.title });
        }));
        // Wait for all shop operations to complete
        const shops = yield Promise.all(requests);
        const uniqueShops = new Map();
        shops.map((shop) => {
            if (!uniqueShops.has(shop.profileName)) {
                uniqueShops.set(shop.profileName, shop);
            }
        });
        const results = Array.from(uniqueShops.values());
        if (results.length === 0) {
            const err = new Error("No mirror items up for service.");
            err.status(400);
            next(err);
        }
        yield db.updateCatalog(results);
        res.json("complete");
    }
    catch (error) {
        console.log(error);
    }
}));
exports.allThreads = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield db.getAllThreads());
}));
exports.threadsInRange = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = req.query.offset - 1 || 0;
    const limit = req.query.limit || 1;
    res.json(yield db.getThreadsInRange(offset, limit));
}));
exports.shopsInRange = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const offset = req.query.offset - 1 || 0;
    const limit = req.query.limit || 1;
    res.json(yield db.getShopsInRange(offset, limit));
}));
exports.filteredItems = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = {
        titleFilters: req.query.title !== undefined
            ? Array.isArray(req.query.title)
                ? req.query.title
                : [req.query.title]
            : undefined,
        modFilters: req.query.mod !== undefined
            ? Array.isArray(req.query.mod)
                ? req.query.mod
                : [req.query.mod]
            : undefined,
        baseFilters: req.query.base !== undefined
            ? Array.isArray(req.query.base)
                ? req.query.base
                : [req.query.base]
            : undefined,
    };
    res.json(yield db.getFilteredItems(filters));
}));
