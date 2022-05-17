const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');

router.get('/', requestController.List);
router.get('/:id', requestController.One);
router.put('/:id', requestController.Update);
router.delete('/:id', requestController.Delete);


module.exports = router;