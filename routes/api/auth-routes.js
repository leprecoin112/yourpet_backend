const express = require("express");

const ctrl = require("../../controllers/auth-controllers");

const {authenticate} = require("../../middlewares");

const { validateBody } = require("../../utils");

const { schemas } = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register)

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout",  authenticate, ctrl.logout );

module.exports = router;
