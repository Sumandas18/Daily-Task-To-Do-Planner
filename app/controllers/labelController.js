const Label = require('../models/Label');

class LabelController {
  static async addLabel(req, res) {
    try {
      const { name, color } = req.body;
      const label = await Label.create({ user: req.user.id, name, color });
      res.status(201).json({ success: true, data: label });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getLabels(req, res) {
    try {
      const labels = await Label.find({ user: req.user.id });
      res.status(200).json({ success: true, data: labels });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getLabel(req, res) {
    try {
      const label = await Label.findOne({ _id: req.params.labelId, user: req.user.id });
      if (!label) return res.status(404).json({ success: false, message: 'Label not found' });
      res.status(200).json({ success: true, data: label });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateLabel(req, res) {
    try {
      let label = await Label.findOne({ _id: req.params.labelId, user: req.user.id });
      if (!label) return res.status(404).json({ success: false, message: 'Label not found' });
      
      label = await Label.findByIdAndUpdate(req.params.labelId, req.body, { new: true, runValidators: true });
      res.status(200).json({ success: true, data: label });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteLabel(req, res) {
    try {
      const label = await Label.findOne({ _id: req.params.labelId, user: req.user.id });
      if (!label) return res.status(404).json({ success: false, message: 'Label not found' });
      
      await label.deleteOne();
      res.status(200).json({ success: true, message: 'Label deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = LabelController;
