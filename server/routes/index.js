import express from "express";
import * as catalog from "../controllers/catalogController.js";
import shop from "../controllers/shopController.js";
import threads from "../controllers/threadsController.js";

const router = express.Router();

router.get("/api/catalog-update", catalog.catalogUpdate);
router.get("/api/threads/all", catalog.allThreads);
router.get("/api/threads/filter", catalog.someThreads);
router.get("/api/shops", catalog.someShops);
router.get("/api/shop/:threadIndex", shop);
router.get("/api/threads", threads);

export default router;
