const express = require('express');
const router = express.Router();
const qualityController = require('../controllers/quality.controller');
 
router.get('/', qualityController.List);
router.post('/', qualityController.Create);
router.get('/:id', qualityController.One);
router.put('/:id', qualityController.Update);
router.delete('/:id', qualityController.Delete);

module.exports = router;