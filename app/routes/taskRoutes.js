const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const TaskController = require('../controllers/taskController');

const router = express.Router();

router.use(protect);

router.post('/reorder', TaskController.reorderTasks);
router.get('/search', TaskController.searchTasks);
router.get('/today', TaskController.getTasksToday);
router.get('/tomorrow', TaskController.getTasksTomorrow);
router.get('/this-week', TaskController.getTasksThisWeek);
router.get('/overdue', TaskController.getOverdueTasks);
router.get('/completed', TaskController.getCompletedTasks);
router.get('/pending', TaskController.getPendingTasks);

router.route('/')
  .post(TaskController.addTask)
  .get(TaskController.getTasks);

router.route('/:taskId')
  .get(TaskController.getTask)
  .put(TaskController.updateTask)
  .delete(TaskController.deleteTask);

router.patch('/:taskId/status', TaskController.updateTaskStatus);

module.exports = router;
