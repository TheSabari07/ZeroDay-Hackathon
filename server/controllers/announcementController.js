import asyncHandler from 'express-async-handler';
import Announcement from '../models/Announcement.js';
import User from '../models/User.js';

// Create a new announcement
export const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    res.status(400);
    throw new Error('Title, content, and category are required');
  }
  const announcement = await Announcement.create({
    title,
    content,
    category,
    author: req.user._id,
  });
  await announcement.populate('author', 'email');
  res.status(201).json(announcement);
});

// Get all announcements (with optional category filter and date sorting)
export const getAnnouncements = asyncHandler(async (req, res) => {
  const { category, sortBy } = req.query;
  const filter = {};
  if (category) {
    filter.category = category;
  }
  let sort = { date: -1 }; // Default: newest first
  if (sortBy === 'date_asc') sort = { date: 1 };
  if (sortBy === 'date_desc') sort = { date: -1 };
  const announcements = await Announcement.find(filter)
    .populate('author', 'email')
    .sort(sort);
  res.json(announcements);
});

// Get a single announcement by ID
export const getAnnouncementById = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id).populate('author', 'email');
  if (!announcement) {
    res.status(404);
    throw new Error('Announcement not found');
  }
  res.json(announcement);
});

// Update an announcement (author or admin only)
export const updateAnnouncement = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    res.status(404);
    throw new Error('Announcement not found');
  }
  // Only author or admin can update
  if (announcement.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this announcement');
  }
  if (title) announcement.title = title;
  if (content) announcement.content = content;
  if (category) announcement.category = category;
  await announcement.save();
  await announcement.populate('author', 'email');
  res.json(announcement);
});

// Delete an announcement (author or admin only)
export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    res.status(404);
    throw new Error('Announcement not found');
  }
  // Only author or admin can delete
  if (announcement.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this announcement');
  }
  await announcement.deleteOne();
  res.json({ message: 'Announcement deleted successfully' });
}); 