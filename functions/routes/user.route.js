const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
 
router.get('/', userController.List);
router.get('/:id', userController.One);
router.put('/:id', userController.Update);
router.post('/:id/message', userController.SendMessage);
router.delete('/:id', userController.Delete);
router.post('/notify/group', userController.NotifyGroup);

module.exports = router;