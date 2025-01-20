const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chat_controller.js');

router.get('/durations', chartController.getDurations);
router.get('duration-by-category', chartController.getDurationsByCategory);
router.get('/job-categories', chartController.jobCategories);
router.get('/jobs-per-pic', chartController.jobsPerPic);
router.get('/jobs-per-pic-percentage', chartController.jobsPerPicPercentage);
router.get('/job-status-distribution', chartController.jobstatusDistribution);
router.get('/jobs-per-month', chartController.jobsPerMonth);
