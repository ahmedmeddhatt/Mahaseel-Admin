const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
 
router.get('/counters', dashboardController.Counters);
router.get('/charts', dashboardController.Charts);


module.exports = router;