const express = require('express');

const { getAllNotices, addNotice,  } = require('../../controllers/noticesControllers');

const router = express.Router();


router.get('/notices', getAllNotices);
router.post('/notices', addNotice);


module.exports = router;