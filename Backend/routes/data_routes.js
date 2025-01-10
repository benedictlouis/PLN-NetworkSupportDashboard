const express = require('express');
const router = express.Router();
const datacontroller = require('../controllers/data_controller.js');

// Route untuk login
router.get('/all', datacontroller.getAllData);
router.get('/:id', datacontroller.getDataById);
router.post('/input', datacontroller.addData);
router.put('/edit/:id', datacontroller.updateData);
router.delete('/delete/:id', datacontroller.deleteData);

module.exports = router;
