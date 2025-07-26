import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema(
  {
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Poll',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    selectedOption: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a unique compound index on poll and user to ensure one vote per user per poll
VoteSchema.index({ poll: 1, user: 1 }, { unique: true });

export default mongoose.model('Vote', VoteSchema); 