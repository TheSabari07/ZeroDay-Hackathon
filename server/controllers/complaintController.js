import asyncHandler from 'express-async-handler';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

// Create a new complaint
export const createComplaint = asyncHandler(async (req, res) => {
  const { roomNumber, category, description } = req.body;
  if (!roomNumber || !category || !description) {
    res.status(400);
    throw new Error('roomNumber, category, and description are required');
  }
  const complaint = await Complaint.create({
    user: req.user._id,
    roomNumber,
    category,
    description,
  });
  await complaint.populate('user', 'email');
  res.status(201).json(complaint);
});

// Get complaints for the current user
export const getUserComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ user: req.user._id })
    .sort({ createdAt: -1 });
  res.json(complaints);
});

// Get all complaints (admin only, with optional status filter)
export const getAllComplaints = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied, admin only');
  }
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  const complaints = await Complaint.find(filter)
    .populate('user', 'email')
    .sort({ createdAt: -1 });
  res.json(complaints);
});

// Get a single complaint by ID (user or admin)
export const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate('user', 'email');
  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }
  if (
    complaint.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to view this complaint');
  }
  res.json(complaint);
});

// Update complaint status and adminNotes (admin only)
export const updateComplaintStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied, admin only');
  }
  const { status, adminNotes } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }
  if (status) complaint.status = status;
  if (adminNotes !== undefined) complaint.adminNotes = adminNotes;
  await complaint.save();
  await complaint.populate('user', 'email');
  res.json(complaint);
});

// Delete a complaint (user or admin)
export const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }
  if (
    complaint.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this complaint');
  }
  await complaint.deleteOne();
  res.json({ message: 'Complaint deleted successfully' });
}); 