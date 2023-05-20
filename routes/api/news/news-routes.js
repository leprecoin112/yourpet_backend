const express = require("express");

const ctrl = require("../../../controllers/news/news-controllers");

const router = express.Router();

router.get("/", ctrl.getAllNews);
router.get("/search", ctrl.findNewsByTitle);

module.exports = router;
