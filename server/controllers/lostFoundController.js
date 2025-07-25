import asyncHandler from 'express-async-handler';
import LostFoundItem from '../models/LostFoundItem.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

// Create a new lost/found item
export const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, type, location, contactEmail } = req.body;
  if (!title || !description || !category || !type || !location || !contactEmail) {
    res.status(400);
    throw new Error('All required fields must be provided');
  }
  const image = req.file ? req.file.path.replace(/\\/g, '/') : undefined;
  const item = await LostFoundItem.create({
    title,
    description,
    category,
    type,
    location,
    contactEmail,
    image,
    reportedBy: req.user._id,
  });
  await item.populate('reportedBy', 'email');
  res.status(201).json(item);
});

// Get all lost/found items with filtering and sorting
export const getAllItems = asyncHandler(async (req, res) => {
  const { category, type, status, sortBy } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (type) filter.type = type;
  if (status) filter.status = status;
  let sort = { createdAt: -1 };
  if (sortBy === 'oldest') sort = { createdAt: 1 };
  const items = await LostFoundItem.find(filter)
    .populate('reportedBy', 'email')
    .sort(sort);
  res.json(items);
});

// Get a single item by ID
export const getItemById = asyncHandler(async (req, res) => {
  const item = await LostFoundItem.findById(req.params.id).populate('reportedBy', 'email');
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  res.json(item);
});

// Update an item (only by reporter or admin)
export const updateItem = asyncHandler(async (req, res) => {
  const item = await LostFoundItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  if (item.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this item');
  }
  const { title, description, category, type, location, contactEmail } = req.body;
  if (title) item.title = title;
  if (description) item.description = description;
  if (category) item.category = category;
  if (type) item.type = type;
  if (location) item.location = location;
  if (contactEmail) item.contactEmail = contactEmail;
  if (req.file) {
    // Delete old image if exists
    if (item.image) {
      try {
        fs.unlinkSync(path.join(process.cwd(), item.image));
      } catch (err) {
        // Ignore file not found errors
      }
    }
    item.image = req.file.path.replace(/\\/g, '/');
  }
  await item.save();
  await item.populate('reportedBy', 'email');
  res.json(item);
});

// Update item status (admin only)
export const updateItemStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied, admin only');
  }
  const { status } = req.body;
  const item = await LostFoundItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  if (status) item.status = status;
  await item.save();
  await item.populate('reportedBy', 'email');
  res.json(item);
});

// Delete an item (only by reporter or admin)
export const deleteItem = asyncHandler(async (req, res) => {
  const item = await LostFoundItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  if (item.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this item');
  }
  // Delete image file if exists
  if (item.image) {
    try {
      fs.unlinkSync(path.join(process.cwd(), item.image));
    } catch (err) {
      // Ignore file not found errors
    }
  }
  await item.deleteOne();
  res.json({ message: 'Item deleted successfully' });
}); 