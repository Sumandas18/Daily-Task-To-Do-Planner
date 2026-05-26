const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const ReminderController = require('../controllers/reminderController');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(ReminderController.addReminder)
  .get(ReminderController.getReminders);

router.route('/:reminderId')
  .get(ReminderController.getReminder)
  .put(ReminderController.updateReminder)
  .delete(ReminderController.deleteReminder);

router.get('/task/:taskId', ReminderController.getReminderByTask);

module.exports = router;
