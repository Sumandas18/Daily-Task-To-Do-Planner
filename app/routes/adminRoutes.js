const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const AdminController = require('../controllers/adminController');

const router = express.Router();

router.use(protect);
router.use(admin);

router.route('/users')
  .get(AdminController.getUsers);

router.route('/users/:userId')
  .get(AdminController.getUser)
  .delete(AdminController.deleteUser);

router.get('/tasks', AdminController.getTasks);
router.get('/reports', AdminController.getReports);

module.exports = router;
