const Category = require('../models/Category');

class CategoryController {
  static async addCategory(req, res) {
    try {
      const { name, description } = req.body;
      const category = await Category.create({ user: req.user.id, name, description });
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCategories(req, res) {
    try {
      const categories = await Category.find({ user: req.user.id });
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCategory(req, res) {
    try {
      const category = await Category.findOne({ _id: req.params.categoryId, user: req.user.id });
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateCategory(req, res) {
    try {
      let category = await Category.findOne({ _id: req.params.categoryId, user: req.user.id });
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      
      category = await Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true, runValidators: true });
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteCategory(req, res) {
    try {
      const category = await Category.findOne({ _id: req.params.categoryId, user: req.user.id });
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      
      await category.deleteOne();
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = CategoryController;
