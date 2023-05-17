const express = require("express");

const ctrl = require("../../controllers/notices-controllers");

const {authenticate, upload} = require("../../middlewares");

const { validateBody } = require("../../utils");

const { schemas } = require("../../models/notice");

const router = express.Router();


router.get('/search', ctrl.getNoticeByTitle);
router.get('/categories/:category', ctrl.getNoticesByCategory);
router.get('/:noticeId', ctrl.getNoticeById);

router.post('/favorites/:noticeId', authenticate, ctrl.addNoticeToFavorite);
router.get('/favorites', authenticate, ctrl.getFavoriteUserNotices);
router.delete('/favorites/:noticeId', authenticate, ctrl.removeNoticeFromFavorite);

router.post('/:category', authenticate, upload.single('photo'), validateBody(schemas.addNoticeSchema), ctrl.addNoticeByCategory);
router.get('/', authenticate, ctrl.getAllUserNotices);
router.delete('/:noticeId', authenticate, ctrl.removeUserNotice);


module.exports = router;
