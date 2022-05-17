const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');

router.get('/', newsletterController.subscribersList);
router.put('/active/:id', newsletterController.Active);
router.put('/deactive/:id', newsletterController.Deactive);
router.post('/', newsletterController.createSubscriber);

module.exports = router;