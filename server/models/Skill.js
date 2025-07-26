import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Coding', 'Design', 'Languages', 'Academics', 'Music', 'Sports', 'Other'],
  },
  level: {
    type: String,
    default: 'Beginner',
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  },
  availability: {
    type: String,
    trim: true,
  },
  contactMethod: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    default: 'Available',
    enum: ['Available', 'Booked Out', 'Inactive'],
  },
}, {
  timestamps: true,
});

// Index for better query performance
SkillSchema.index({ user: 1, status: 1 });
SkillSchema.index({ category: 1, status: 1 });
SkillSchema.index({ level: 1, status: 1 });

export default mongoose.model('Skill', SkillSchema); 