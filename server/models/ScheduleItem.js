const mongoose = require('mongoose');

const ScheduleItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  dayOfWeek: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  startTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
  },
  endTime: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
  },
  location: {
    type: String,
    default: '',
  },
  instructor: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ScheduleItem', ScheduleItemSchema); 