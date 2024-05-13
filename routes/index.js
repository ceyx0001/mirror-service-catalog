const express = require("express");
const router = express.Router();

const scrapeController = require("../controllers/scrapeController");


router.get("/", scrapeController.scrape);

module.exports = router;
