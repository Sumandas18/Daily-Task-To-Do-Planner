const User = require('../models/User');
const Task = require('../models/Task');

class AdminController {
  static async getUsers(req, res) {
    try {
      const users = await User.find().select('-password');
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getUser(req, res) {
    try {
      const user = await User.findById(req.params.userId).select('-password');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      
      await user.deleteOne();
      // Alternatively you could also delete all tasks associated with this user
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getTasks(req, res) {
    try {
      const tasks = await Task.find().populate('user', 'name email');
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getReports(req, res) {
    try {
      const totalUsers = await User.countDocuments();
      const totalTasks = await Task.countDocuments();
      res.status(200).json({ success: true, data: { totalUsers, totalTasks } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = AdminController;
