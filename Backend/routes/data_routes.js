const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data_controller.js');

// Route untuk login
router.get('/all', dataController.getAllData);
router.get('/durations', dataController.getDurations);
router.get('/:id', dataController.getDataById);
router.post('/input', dataController.addData);
router.put('/edit/:id', dataController.updateData);
router.delete('/delete/:id', dataController.deleteData);


module.exports = router;
