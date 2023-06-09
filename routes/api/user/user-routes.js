const express = require("express");

const ctrl = require("../../../controllers/user/user-controllers");

const { authenticate, upload } = require("../../../middlewares");

const { validateBody } = require("../../../utils");

const { schemas } = require("../../../models/user");

const router = express.Router();
router.get("/", authenticate, ctrl.getUserInfo);

router.get("/pets", authenticate, ctrl.getUserPets);

router.get("/current", authenticate, ctrl.getCurrent);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

router.patch(
  "/name",
  authenticate,
  validateBody(schemas.nameSchema),
  ctrl.updateName
);

router.patch(
  "/phone",
  authenticate,
  validateBody(schemas.phoneSchema),
  ctrl.updatePhone
);

router.patch(
  "/city",
  authenticate,
  validateBody(schemas.citySchema),
  ctrl.updateCity
);

router.patch(
  "/birthday",
  authenticate,
  validateBody(schemas.birthdaySchema),
  ctrl.updateBirthday
);

module.exports = router;
