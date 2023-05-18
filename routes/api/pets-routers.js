const express = require("express");
const ctrl = require("../../controllers/pets-controllers");
const router = express.Router();
const { upload, authenticate, validationId } = require("../../middlewares");
const { validateBody } = require("../../utils");

const {petAddJoiSchema} = require('../../models/pets')
router.post("/", authenticate, upload.single("avatar"), validateBody(petAddJoiSchema), ctrl.addPets);
router.delete("/:id", validationId, authenticate, ctrl.deletePet);
module.exports = router;
