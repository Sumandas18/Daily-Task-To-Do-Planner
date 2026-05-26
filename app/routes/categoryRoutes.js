const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const CategoryController = require('../controllers/categoryController');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(CategoryController.addCategory)
  .get(CategoryController.getCategories);

router.route('/:categoryId')
  .get(CategoryController.getCategory)
  .put(CategoryController.updateCategory)
  .delete(CategoryController.deleteCategory);

module.exports = router;
