const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');


router.post('/upload',mediaController.uploadFile);
router.delete('/remove/:file',mediaController.removeFile);

module.exports = router;