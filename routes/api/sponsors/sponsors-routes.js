const express = require("express");

const ctrl = require("../../../controllers/sponsors/sponsors-controllers");

const router = express.Router();

router.get("/", ctrl.getAllSponsors);

module.exports = router;
