import express from "express";
import { catalog_details, catalog_update } from "../controllers/catalogController.js";
import shop from "../controllers/shopController.js";
import threads from "../controllers/threadsController.js";

const router = express.Router();

router.get("/api/catalog-update", catalog_update);
router.get("/api/catalog", catalog_details);
router.get("/api/threads", threads);
router.get("/api/shop/:threadIndex", shop);

export default router;
