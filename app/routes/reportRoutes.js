const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const ReportController = require('../controllers/reportController');

const router = express.Router();

router.use(protect);

router.get('/daily-summary', ReportController.getDailySummary);
router.get('/weekly-summary', ReportController.getWeeklySummary);
router.get('/monthly-summary', ReportController.getMonthlySummary);
router.get('/statistics', ReportController.getStatistics);
router.get('/productivity', ReportController.getProductivity);
router.get('/completion-rate', ReportController.getCompletionRate);
router.get('/overdue-tasks', ReportController.getOverdueTasks);
router.get('/upcoming-tasks', ReportController.getUpcomingTasks);

router.post('/send-daily-email', ReportController.sendDailyEmail);
router.post('/send-weekly-email', ReportController.sendWeeklyEmail);

module.exports = router;
