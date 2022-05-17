const express = require('express');
const router = express.Router();
const cropController = require('../controllers/crop.controller');
 
router.get('/', cropController.List);
router.post('/', cropController.Create);
router.get('/:id', cropController.One);
router.put('/:id', cropController.Update);
router.delete('/:id', cropController.Delete);

module.exports = router;