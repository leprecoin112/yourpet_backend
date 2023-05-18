const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/user-controllers");

const { authenticate } = require("../../middlewares");

router.get("/", authenticate, ctrl.getUserInfo);

router.get("/pets", authenticate, ctrl.getUserPets);
//	ffdddf

module.exports = router;
