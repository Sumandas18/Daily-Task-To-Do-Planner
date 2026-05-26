const Notification = require('../models/Notification');

class NotificationController {
  static async sendNotification(req, res) {
    try {
      const { message, type } = req.body;
      const notification = await Notification.create({ user: req.user.id, message, type });
      res.status(201).json({ success: true, data: notification });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getNotifications(req, res) {
    try {
      const notifications = await Notification.find({ user: req.user.id }).sort('-createdAt');
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getNotification(req, res) {
    try {
      const notification = await Notification.findOne({ _id: req.params.notificationId, user: req.user.id });
      if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
      res.status(200).json({ success: true, data: notification });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async markAsRead(req, res) {
    try {
      const notification = await Notification.findOne({ _id: req.params.notificationId, user: req.user.id });
      if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
      
      notification.isRead = true;
      await notification.save();
      res.status(200).json({ success: true, data: notification });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteNotification(req, res) {
    try {
      const notification = await Notification.findOne({ _id: req.params.notificationId, user: req.user.id });
      if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
      
      await notification.deleteOne();
      res.status(200).json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = NotificationController;
