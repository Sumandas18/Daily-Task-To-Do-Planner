const Task = require('../models/Task');
const sendEmail = require('../utils/emailService');

class ReportController {
  static async getDailySummary(req, res) {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const tasks = await Task.find({ user: req.user.id, dueDate: { $gte: startOfDay, $lte: endOfDay } });
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'Completed').length;
      const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

      res.status(200).json({ success: true, data: { totalTasks, completedTasks, pendingTasks } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getWeeklySummary(req, res) {
    try {
      const curr = new Date();
      const first = curr.getDate() - curr.getDay();
      const startOfWeek = new Date(curr.setDate(first));
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(curr.setDate(first + 6));
      endOfWeek.setHours(23, 59, 59, 999);

      const tasks = await Task.find({ user: req.user.id, dueDate: { $gte: startOfWeek, $lte: endOfWeek } });
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'Completed').length;
      const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

      res.status(200).json({ success: true, data: { totalTasks, completedTasks, pendingTasks } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getMonthlySummary(req, res) {
    try {
      const date = new Date();
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

      const tasks = await Task.find({ user: req.user.id, dueDate: { $gte: startOfMonth, $lte: endOfMonth } });
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'Completed').length;
      const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

      res.status(200).json({ success: true, data: { totalTasks, completedTasks, pendingTasks } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getStatistics(req, res) {
    try {
      const totalTasks = await Task.countDocuments({ user: req.user.id });
      const completedTasks = await Task.countDocuments({ user: req.user.id, status: 'Completed' });
      const pendingTasks = await Task.countDocuments({ user: req.user.id, status: 'Pending' });

      // Calculate average time to complete tasks
      const completedTasksList = await Task.find({ user: req.user.id, status: 'Completed' });
      let totalTime = 0;
      let avgTimeInHours = 0;
      if (completedTasksList.length > 0) {
        completedTasksList.forEach(task => {
          const timeDiff = new Date(task.updatedAt) - new Date(task.createdAt);
          totalTime += timeDiff;
        });
        const avgTimeMs = totalTime / completedTasksList.length;
        avgTimeInHours = (avgTimeMs / (1000 * 60 * 60)).toFixed(2); // converting to hours
      }

      res.status(200).json({
        success: true,
        data: {
          totalTasks,
          completedTasks,
          pendingTasks,
          averageCompletionTimeHours: avgTimeInHours
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getProductivity(req, res) {
    try {
      // Basic productivity calculation based on tasks completed in last 7 days vs previous 7 days
      res.status(200).json({ success: true, message: 'Productivity data not fully implemented yet' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCompletionRate(req, res) {
    try {
      const totalTasks = await Task.countDocuments({ user: req.user.id });
      const completedTasks = await Task.countDocuments({ user: req.user.id, status: 'Completed' });
      
      const rate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
      
      res.status(200).json({ success: true, data: { completionRate: rate.toFixed(2) } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getOverdueTasks(req, res) {
    try {
      const now = new Date();
      const tasks = await Task.find({ user: req.user.id, dueDate: { $lt: now }, status: 'Pending' });
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getUpcomingTasks(req, res) {
    try {
      const now = new Date();
      const tasks = await Task.find({ user: req.user.id, dueDate: { $gte: now }, status: 'Pending' });
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async sendDailyEmail(req, res) {
    try {
      const now = new Date();
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const upcoming = await Task.find({ user: req.user.id, dueDate: { $gte: startOfDay, $lte: endOfDay }, status: 'Pending' });
      const overdue = await Task.find({ user: req.user.id, dueDate: { $lt: now }, status: 'Pending' });
      const completed = await Task.find({ user: req.user.id, updatedAt: { $gte: startOfDay, $lte: endOfDay }, status: 'Completed' });

      const message = `
        Daily Summary:
        Upcoming Tasks Today: ${upcoming.length}
        Overdue Tasks: ${overdue.length}
        Tasks Completed Today: ${completed.length}
      `;

      await sendEmail({
        email: req.user.email,
        subject: 'Your Daily Task Summary',
        message
      });

      res.status(200).json({ success: true, message: 'Daily email sent successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async sendWeeklyEmail(req, res) {
    try {
      const curr = new Date();
      const first = curr.getDate() - curr.getDay();
      const startOfWeek = new Date(curr.setDate(first));
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(curr.setDate(first + 6));
      endOfWeek.setHours(23, 59, 59, 999);

      const upcoming = await Task.find({ user: req.user.id, dueDate: { $gte: startOfWeek, $lte: endOfWeek }, status: 'Pending' });
      const overdue = await Task.find({ user: req.user.id, dueDate: { $lt: new Date() }, status: 'Pending' });
      const completed = await Task.find({ user: req.user.id, updatedAt: { $gte: startOfWeek, $lte: endOfWeek }, status: 'Completed' });

      const message = `
        Weekly Summary:
        Upcoming Tasks This Week: ${upcoming.length}
        Overdue Tasks: ${overdue.length}
        Tasks Completed This Week: ${completed.length}
      `;

      await sendEmail({
        email: req.user.email,
        subject: 'Your Weekly Task Summary',
        message
      });

      res.status(200).json({ success: true, message: 'Weekly email sent successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = ReportController;
