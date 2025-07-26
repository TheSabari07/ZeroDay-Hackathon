import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      minlength: 10,
    },
    options: {
      type: [String],
      required: true,
      minlength: 2,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Poll', PollSchema); 