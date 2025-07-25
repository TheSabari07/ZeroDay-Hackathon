import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
    },
    category: {
      type: String,
      required: true,
      enum: ['General', 'Academics', 'Events', 'Holidays', 'Exams', 'Other'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', AnnouncementSchema); 