const Reminder = require('../models/Reminder');

class ReminderController {
  static async addReminder(req, res) {
    try {
      const { task, remindAt, type } = req.body;
      const reminder = await Reminder.create({ user: req.user.id, task, remindAt, type });
      res.status(201).json({ success: true, data: reminder });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getReminders(req, res) {
    try {
      const reminders = await Reminder.find({ user: req.user.id }).populate('task');
      res.status(200).json({ success: true, data: reminders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getReminder(req, res) {
    try {
      const reminder = await Reminder.findOne({ _id: req.params.reminderId, user: req.user.id }).populate('task');
      if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });
      res.status(200).json({ success: true, data: reminder });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getReminderByTask(req, res) {
    try {
      const reminders = await Reminder.find({ task: req.params.taskId, user: req.user.id });
      res.status(200).json({ success: true, data: reminders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateReminder(req, res) {
    try {
      let reminder = await Reminder.findOne({ _id: req.params.reminderId, user: req.user.id });
      if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });
      
      reminder = await Reminder.findByIdAndUpdate(req.params.reminderId, req.body, { new: true, runValidators: true });
      res.status(200).json({ success: true, data: reminder });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteReminder(req, res) {
    try {
      const reminder = await Reminder.findOne({ _id: req.params.reminderId, user: req.user.id });
      if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });
      
      await reminder.deleteOne();
      res.status(200).json({ success: true, message: 'Reminder deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = ReminderController;
