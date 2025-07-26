import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Skill from '../models/Skill.js';
import User from '../models/User.js';

// Create a new booking
const createBooking = asyncHandler(async (req, res) => {
  const { skillId, proposedDateTime, message } = req.body;

  // Validate required fields
  if (!skillId || !proposedDateTime) {
    res.status(400);
    throw new Error('Missing required fields: skillId and proposedDateTime are required');
  }

  // Validate proposedDateTime is in the future
  const proposedDate = new Date(proposedDateTime);
  if (proposedDate <= new Date()) {
    res.status(400);
    throw new Error('Proposed date and time must be in the future');
  }

  // Find the skill and validate it exists and is available
  const skill = await Skill.findById(skillId);
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  if (skill.status !== 'Available') {
    res.status(400);
    throw new Error('This skill is not available for booking');
  }

  // Prevent booking your own skill
  if (skill.user.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot book your own skill');
  }

  // Check if there's already a pending booking for this skill and student
  const existingBooking = await Booking.findOne({
    skill: skillId,
    student: req.user._id,
    status: { $in: ['Pending', 'Accepted'] }
  });

  if (existingBooking) {
    res.status(400);
    throw new Error('You already have a pending or accepted booking for this skill');
  }

  // Create the booking
  const booking = await Booking.create({
    skill: skillId,
    tutor: skill.user,
    student: req.user._id,
    proposedDateTime: proposedDate,
    message,
  });

  // Populate related fields
  await booking.populate([
    { path: 'skill', select: 'title category level' },
    { path: 'tutor', select: 'email name' },
    { path: 'student', select: 'email name' }
  ]);

  res.status(201).json(booking);
});

// Get all bookings made by the current user
const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ student: req.user._id })
    .populate([
      { path: 'skill', select: 'title category level description' },
      { path: 'tutor', select: 'email name' }
    ])
    .sort({ proposedDateTime: 1 });

  res.json(bookings);
});

// Get all bookings for skills offered by the current user
const getTutorBookings = asyncHandler(async (req, res) => {
  // First get all skills offered by the current user
  const userSkills = await Skill.find({ user: req.user._id });
  const skillIds = userSkills.map(skill => skill._id);

  const bookings = await Booking.find({ skill: { $in: skillIds } })
    .populate([
      { path: 'skill', select: 'title category level description' },
      { path: 'student', select: 'email name' }
    ])
    .sort({ proposedDateTime: 1 });

  res.json(bookings);
});

// Update booking status
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user is authorized to update (student, tutor, or admin)
  const isStudent = booking.student.toString() === req.user._id.toString();
  const isTutor = booking.tutor.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isStudent && !isTutor && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  // Validate status transition
  const validStatuses = ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Must be one of: Pending, Accepted, Rejected, Completed, Cancelled');
  }

  // Prevent certain status changes based on current status
  if (booking.status === 'Completed' || booking.status === 'Cancelled') {
    res.status(400);
    throw new Error(`Cannot update booking with status: ${booking.status}`);
  }

  // Only allow specific status transitions
  if (booking.status === 'Pending') {
    if (!['Accepted', 'Rejected', 'Cancelled'].includes(status)) {
      res.status(400);
      throw new Error('Pending bookings can only be Accepted, Rejected, or Cancelled');
    }
  } else if (booking.status === 'Accepted') {
    if (!['Completed', 'Cancelled'].includes(status)) {
      res.status(400);
      throw new Error('Accepted bookings can only be Completed or Cancelled');
    }
  }

  // Update the status
  booking.status = status;
  const updatedBooking = await booking.save();

  // Populate related fields
  await updatedBooking.populate([
    { path: 'skill', select: 'title category level description' },
    { path: 'tutor', select: 'email name' },
    { path: 'student', select: 'email name' }
  ]);

  res.json(updatedBooking);
});

// Get a single booking by ID
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate([
      { path: 'skill', select: 'title category level description' },
      { path: 'tutor', select: 'email name' },
      { path: 'student', select: 'email name' }
    ]);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user is authorized to view (student, tutor, or admin)
  const isStudent = booking.student.toString() === req.user._id.toString();
  const isTutor = booking.tutor.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isStudent && !isTutor && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json(booking);
});

// Delete a booking
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user is authorized to delete (student who made it or admin)
  const isStudent = booking.student.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isStudent && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this booking');
  }

  // Only allow deletion of pending or rejected bookings
  if (booking.status === 'Accepted' || booking.status === 'Completed') {
    res.status(400);
    throw new Error('Cannot delete accepted or completed bookings');
  }

  await booking.deleteOne();

  res.json({ message: 'Booking deleted successfully' });
});

export {
  createBooking,
  getUserBookings,
  getTutorBookings,
  updateBookingStatus,
  getBookingById,
  deleteBooking,
}; 