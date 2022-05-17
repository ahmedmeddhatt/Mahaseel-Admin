const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');

router.get('/', locationController.Governorates);
router.get('/:governorateid', locationController.Centers);
router.get('/:id/:centerid', locationController.Hamlets);
router.put('/:id', locationController.Update);
router.put('/active/:id', locationController.Active);
router.put('/deactive/:id', locationController.Deactive);
router.post('/', locationController.Create);
router.delete('/:id', locationController.Delete);

module.exports = router;