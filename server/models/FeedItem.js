import mongoose from 'mongoose';

const FeedItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
    },
    link: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['News', 'Internship', 'Hackathon', 'Workshop', 'Scholarship', 'Other'],
    },
    relevantDate: {
      type: Date,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('FeedItem', FeedItemSchema); 