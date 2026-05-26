const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const NotificationController = require('../controllers/notificationController');

const router = express.Router();

router.use(protect);

router.route('/send').post(NotificationController.sendNotification);

router.route('/')
  .get(NotificationController.getNotifications);

router.route('/:notificationId')
  .get(NotificationController.getNotification)
  .delete(NotificationController.deleteNotification);

router.patch('/:notificationId/read', NotificationController.markAsRead);

module.exports = router;
