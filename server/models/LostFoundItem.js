import mongoose from 'mongoose';

const LostFoundItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Stationery', 'Books', 'Keys', 'Documents', 'Jewelry', 'Other'],
  },
  type: {
    type: String,
    required: true,
    enum: ['Lost', 'Found'],
  },
  image: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Claimed', 'Returned'],
    default: 'Pending',
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('LostFoundItem', LostFoundItemSchema); 