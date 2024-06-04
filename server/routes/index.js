import express from "express";
import * as catalog from "../controllers/catalogController.js";
import shop from "../controllers/shopController.js";
import threads from "../controllers/threadsController.js";

const router = express.Router();

router.get("/api/catalog-update", catalog.catalogUpdate);
router.get("/api/threads", catalog.allThreads);
router.get("/api/threads/range", catalog.threadsInRange);
router.get("/api/shops/range", catalog.shopsInRange);
router.get("/api/shop/:threadIndex", shop);

router.get("/api/items/filter", catalog.filteredItems);

export default router;
