import express from "express";
import * as catalog from "../controllers/catalogController";
import shop from "../controllers/shopController";

const router = express.Router();

router.get("/catalog-update", catalog.catalogUpdate);
router.get("/threads", catalog.allThreads);
router.get("/threads/range", catalog.threadsInRange);
router.get("/shops/range", catalog.shopsInRange);
router.get("/shop/:threadIndex", shop);

router.get("/items/filter", catalog.filteredItems);

export default router;
