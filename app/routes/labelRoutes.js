const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const LabelController = require('../controllers/labelController');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(LabelController.addLabel)
  .get(LabelController.getLabels);

router.route('/:labelId')
  .get(LabelController.getLabel)
  .put(LabelController.updateLabel)
  .delete(LabelController.deleteLabel);

module.exports = router;
