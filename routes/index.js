const express = require("express");
const router = express.Router();

const catalogController = require("../controllers/catalogController");
const shopController = require("../controllers/shopController");
const threadController = require("../controllers/threadsController");

router.get("/catalog", catalogController.catalog);
router.get("/threads", threadController.threads);
router.get("/shop/:threadIndex", shopController.shop);

module.exports = router;
