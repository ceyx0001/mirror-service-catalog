import express from "express";
import * as catalog from "../controllers/catalogController";
import shop from "../controllers/shopController";
import { threads } from "../controllers/threadsController";

const router = express.Router();

router.get("/api/catalog-update", catalog.catalogUpdate);
router.get("/api/threads", catalog.allThreads);
router.get("/api/threads/range", catalog.threadsInRange);
router.get("/api/shops/range", catalog.shopsInRange);
router.get("/api/shop/:threadIndex", shop);

router.get("/api/items/filter", catalog.filteredItems);

export default router;
