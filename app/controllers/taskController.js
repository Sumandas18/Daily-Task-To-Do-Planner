const Task = require('../models/Task');

// Date helper
const getStartAndEndOfDay = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

class TaskController {
  static async addTask(req, res) {
    try {
      const { title, description, priority, dueDate, category, labels } = req.body;
      
      // without title we can't save task
      if (!title) {
        return res.status(400).json({ success: false, message: 'Title na dile task save hobe na' });
      }

      const task = await Task.create({
        user: req.user.id,
        title,
        description,
        priority,
        dueDate,
        category,
        labels,
      });
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      console.log('Task create problem:', error);
      res.status(500).json({ success: false, message: 'Task add korte problem hocche' });
    }
  }

  static async getTasks(req, res) {
    try {
      const { dueDate, status, category, label } = req.query;
      let query = { user: req.user.id };

      if (status) query.status = status;
      if (category) query.category = category;
      if (label) query.labels = label;
      if (dueDate) query.dueDate = { $lte: new Date(dueDate) };

      const tasks = await Task.find(query).populate('category').populate('labels').sort({ order: 1 });
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getTask(req, res) {
    try {
      const task = await Task.findOne({ _id: req.params.taskId, user: req.user.id })
        .populate('category')
        .populate('labels');
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateTask(req, res) {
    try {
      let task = await Task.findOne({ _id: req.params.taskId, user: req.user.id });
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true, runValidators: true });
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteTask(req, res) {
    try {
      const task = await Task.findOne({ _id: req.params.taskId, user: req.user.id });
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      await task.deleteOne();
      res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateTaskStatus(req, res) {
    try {
      const { status } = req.body;
      let task = await Task.findOne({ _id: req.params.taskId, user: req.user.id });
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      task.status = status;
      await task.save();
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async reorderTasks(req, res) {
    try {
      const { tasks } = req.body;
      for (let i = 0; i < tasks.length; i++) {
        await Task.findOneAndUpdate({ _id: tasks[i].id, user: req.user.id }, { order: tasks[i].order });
      }
      res.status(200).json({ success: true, message: 'Tasks reordered successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async searchTasks(req, res) {
    try {
      const { q } = req.query;
      const tasks = await Task.find({
        user: req.user.id,
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      });
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getTasksToday(req, res) {
    try {
      const { start, end } = getStartAndEndOfDay();
      const tasks = await Task.find({ user: req.user.id, dueDate: { $gte: start, $lte: end } });
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getTasksTomorrow(req, res) {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const { start, end } = getStartAndEndOfDay(tomorrow);
      const tasks = await Task.find({ user: req.user.id, dueDate: { $gte: start, $lte: end } });
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getTasksThisWeek(req, res) {
    try {
      const curr = new Date();
      const first = curr.getDate() - curr.getDay(); 
      const last = first + 6; 
      
      const start = new Date(curr.setDate(first));
      start.setHours(0,0,0,0);
      const end = new Date(curr.setDate(last));
      end.setHours(23,59,59,999);

      const tasks = await Task.find({ user: req.user.id, dueDate: { $gte: start, $lte: end } });
      res.status(200).json({ success: true, data: tasks });
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

  static async getCompletedTasks(req, res) {
    try {
      const tasks = await Task.find({ user: req.user.id, status: 'Completed' });
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getPendingTasks(req, res) {
    try {
      const tasks = await Task.find({ user: req.user.id, status: 'Pending' });
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = TaskController;
