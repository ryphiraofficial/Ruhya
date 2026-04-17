const mongoose = require('mongoose');

const therapyNeedSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('TherapyNeed', therapyNeedSchema);
