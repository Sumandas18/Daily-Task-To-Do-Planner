const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  remindAt: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['Notification', 'Email', 'Repeating'],
    default: 'Notification',
  },
  isSent: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
