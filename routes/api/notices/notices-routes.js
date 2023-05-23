const express = require("express");

const ctrl = require("../../../controllers/notices/notices-controllers");

const { authenticate, upload } = require("../../../middlewares");

const { validateBody } = require("../../../utils");

const { schemas } = require("../../../models/notice");

const router = express.Router();

router.get("/all", ctrl.getAllNotices);
router.get("/search", ctrl.getNoticesBySearchParams);

router.post("/favorites/:noticeId", authenticate, ctrl.addNoticeToFavorite);
router.get("/favorites", authenticate, ctrl.getFavoriteUserNotices);
router.delete(
  "/favorites/:noticeId",
  authenticate,
  ctrl.removeNoticeFromFavorite
);

router.post(
  "/:category",
  authenticate,
  upload.single("photo"),
  ctrl.addNoticeByCategory
);
router.get("/", authenticate, ctrl.getAllUserNotices);
router.delete("/:noticeId", authenticate, ctrl.removeUserNotice);
router.get("/:noticeId", ctrl.getNoticeId);

module.exports = router;
