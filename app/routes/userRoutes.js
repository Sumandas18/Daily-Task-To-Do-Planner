const express = require('express');
const UserController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/profile')
  .get(UserController.getProfile)
  .put(UserController.updateProfile)
  .delete(UserController.deleteProfile);

module.exports = router;
