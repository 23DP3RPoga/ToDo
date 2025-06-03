const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['Completed', 'Not Completed'], default: 'Not Completed' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Task', taskSchema);