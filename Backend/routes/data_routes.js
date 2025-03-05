const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data_controller.js');
const authMiddleware = require('../middleware/auth_middleware.js');


// Route untuk login
router.get('/all', dataController.getAllData);
router.get('/unvalidate', dataController.getUnvalidatedData);
router.get('/durations', dataController.getDurations);
router.get('/summary', dataController.getJobSummary);
router.get('/sumcategory', dataController.getUnfinishedJobsByCategory);
router.get('/sumstatus', dataController.getJobsByStatus);
router.get('/history/:id', dataController.getHistoryByTaskId);
router.get('/:id', dataController.getDataById);
router.post('/input', dataController.addData);
router.put('/edit/:id', authMiddleware.requireRole(['Support', 'Admin', 'Super Admin']), dataController.updateData);
router.delete('/delete/:id', authMiddleware.requireRole(['Admin', 'Super Admin']), dataController.deleteData);
router.get('/avg-duration-per-pic', dataController.getAverageDurationPerPIC);
router.get('/pic-performance', dataController.getPICPerformance);

module.exports = router;
