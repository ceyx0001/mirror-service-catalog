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
exports.threads = exports.getThreadsData = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const getThreadsData = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.startPage = parseInt(req.query.startPage, 10) || 1;
    req.endPage = parseInt(req.query.endPage, 10) || 50;
    let threads = [];
    if (req.startPage > req.endPage) {
        const err = new Error("Page number to start indexing threads is greater than the last page.");
        err.status(400);
        next(err);
    }
    const promises = Array.from({ length: req.endPage - req.startPage + 1 }, (_, i) => __awaiter(void 0, void 0, void 0, function* () {
        const url = `https://www.pathofexile.com/forum/view-forum/standard-trading-shops/page/${i + req.startPage}`;
        const response = yield axios_1.default.get(url, {
            headers: {
                "User-Agent": `Mirror-Catalog/1.0 (${process.env.DEV_EMAIL}) Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3`,
            },
        });
        const document = cheerio_1.default.load(response.data);
        document("tr .title a").each((i, elem) => {
            try {
                const element = document(elem);
                const shopTitle = element.text().toLowerCase().trim();
                if (shopTitle.includes("mirror") &&
                    (shopTitle.includes("service") || shopTitle.includes("shop"))) {
                    const thread = {
                        index: parseInt(document(elem).attr("href").replace(/\D/g, "")),
                        views: parseInt(document(elem)
                            .closest("td.thread")
                            .next()
                            .find("div.post-stat")
                            .text()
                            .replace(/\D/g, "")),
                        title: shopTitle,
                    };
                    threads.push(thread);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }));
    yield Promise.all(promises);
    if (threads.length === 0) {
        const err = new Error("No mirror threads found.");
        err.status(400);
        next(err);
    }
    threads.sort();
    return threads;
});
exports.getThreadsData = getThreadsData;
const threads = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, exports.getThreadsData)(req, next);
});
exports.threads = threads;
