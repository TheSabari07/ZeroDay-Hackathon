const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
    minlength: 1,
  },
  category: {
    type: String,
    required: true,
    enum: ['Water', 'Electricity', 'Cleaning', 'Furniture', 'Other'],
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  status: {
    type: String,
    enum: ['Pending', 'In-Progress', 'Resolved', 'Rejected'],
    default: 'Pending',
  },
  adminNotes: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema); 