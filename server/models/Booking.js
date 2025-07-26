import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  proposedDateTime: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'],
  },
}, {
  timestamps: true,
});

// Index for better query performance
BookingSchema.index({ skill: 1, status: 1 });
BookingSchema.index({ tutor: 1, status: 1 });
BookingSchema.index({ student: 1, status: 1 });
BookingSchema.index({ proposedDateTime: 1, status: 1 });

// Virtual populate for skill details
BookingSchema.virtual('skillDetails', {
  ref: 'Skill',
  localField: 'skill',
  foreignField: '_id',
  justOne: true,
});

// Virtual populate for tutor details
BookingSchema.virtual('tutorDetails', {
  ref: 'User',
  localField: 'tutor',
  foreignField: '_id',
  justOne: true,
});

// Virtual populate for student details
BookingSchema.virtual('studentDetails', {
  ref: 'User',
  localField: 'student',
  foreignField: '_id',
  justOne: true,
});

// Ensure virtuals are included when converting to JSON
BookingSchema.set('toJSON', { virtuals: true });
BookingSchema.set('toObject', { virtuals: true });

export default mongoose.model('Booking', BookingSchema); 