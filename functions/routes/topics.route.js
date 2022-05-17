const express = require('express');
const router = express.Router();
const topicsController = require('../controllers/topics.controller');

router.get('/', topicsController.topicsList);
router.put('/:id', topicsController.updateTopic);
router.put('/active/:id', topicsController.activeTopic);
router.put('/deactive/:id', topicsController.deactiveTopic);
router.post('/', topicsController.createTopic);
router.delete('/:id', topicsController.deleteTopic);

module.exports = router;