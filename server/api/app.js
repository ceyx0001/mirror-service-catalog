"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const express_rate_limit_1 = require("express-rate-limit");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.ORIGIN,
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
app.use("/", routes_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
});
app.get("/", (req, res) => {
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
exports.default = app;
