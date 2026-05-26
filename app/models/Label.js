const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#000000',
  }
}, { timestamps: true });

module.exports = mongoose.model('Label', labelSchema);
