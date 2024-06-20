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
exports.db = exports.app = void 0;
require("dotenv/config");
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const express_rate_limit_1 = require("express-rate-limit");
const app = (0, express_1.default)();
exports.app = app;
// Enable CORS only for localhost:3001
app.use((0, cors_1.default)({
    origin: "",
}));
app.set("trust proxy", 1);
const timeout = 1 * 5 * 1000;
const window = 1 * 5 * 1000;
app.use((0, express_rate_limit_1.rateLimit)({
    windowMs: window,
    skipFailedRequests: true,
    limit: 5,
    message: { message: "Rate limit exceeded.", timeout: timeout },
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(path_1.default.resolve(), "public")));
app.use("/", index_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
});
app.get("/api/", (req, res) => {
    const { query } = req.query;
    // Check if any query string value is negative
    for (let key in query) {
        if (Number(query[key]) <= 0) {
            return res
                .status(400)
                .send(`Query parameter ${key} has an invalid value: ${query[key]}`);
        }
    }
});
const postgres_1 = __importDefault(require("postgres"));
const postgres_js_1 = require("drizzle-orm/postgres-js");
const catalogSchema = __importStar(require("./db/schemas/catalogSchema"));
const itemsSchema = __importStar(require("./db/schemas/itemsSchema"));
const modsSchema = __importStar(require("./db/schemas/modsSchema"));
let db;
main().catch((err) => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const connectionString = process.env.SUPABASE_URL;
        const client = (0, postgres_1.default)(connectionString, {
            username: `${process.env.SUPABASE_USER}`,
            prepare: false,
        });
        exports.db = db = (0, postgres_js_1.drizzle)(client, {
            schema: Object.assign(Object.assign(Object.assign({}, catalogSchema), itemsSchema), modsSchema),
        });
    });
}
