const express = require('express');
const router = express.Router();
const certController = require('../controllers/cert.controller');


router.post('/upload/:code',certController.uploadFile);
router.post('/reject/:code',certController.reject);
router.get('/download/:name',certController.download);

module.exports = router;