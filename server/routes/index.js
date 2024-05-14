const express = require("express");
const router = express.Router();

const catalogController = require("../controllers/catalogController");
const shopController = require("../controllers/shopController");
const threadController = require("../controllers/threadsController");

router.get("/api/catalog", catalogController.catalog);
router.get("/api/threads", threadController.threads);
router.get("/api/shop/:threadIndex", shopController.shop);

module.exports = router;
