import asyncHandler from 'express-async-handler';
import FeedItem from '../models/FeedItem.js';
import User from '../models/User.js';

// Create a new feed item
const createFeedItem = asyncHandler(async (req, res) => {
  const { title, description, link, type, relevantDate } = req.body;

  // Validate required fields
  if (!title || !description || !link || !type) {
    res.status(400);
    throw new Error('Title, description, link, and type are required');
  }

  // Validate description length
  if (description.length < 20) {
    res.status(400);
    throw new Error('Description must be at least 20 characters long');
  }

  // Create the feed item
  const feedItem = await FeedItem.create({
    title,
    description,
    link,
    type,
    relevantDate,
    postedBy: req.user._id,
  });

  // Populate user info
  await feedItem.populate('postedBy', 'email');

  res.status(201).json(feedItem);
});

// Get all feed items with filtering and sorting
const getAllFeedItems = asyncHandler(async (req, res) => {
  const { type, sortBy } = req.query;

  // Build filter object
  const filter = {};

  // Add type filter
  if (type) {
    filter.type = type;
  }

  // Build sort object
  let sort = { createdAt: -1 }; // Default: newest first
  if (sortBy === 'relevantDate') {
    sort = { relevantDate: -1 };
  } else if (sortBy === 'relevantDate_asc') {
    sort = { relevantDate: 1 };
  } else if (sortBy === 'createdAt_asc') {
    sort = { createdAt: 1 };
  }

  const feedItems = await FeedItem.find(filter)
    .populate('postedBy', 'email')
    .sort(sort);

  res.json(feedItems);
});

// Get a single feed item by ID
const getFeedItemById = asyncHandler(async (req, res) => {
  const feedItem = await FeedItem.findById(req.params.id)
    .populate('postedBy', 'email');

  if (!feedItem) {
    res.status(404);
    throw new Error('Feed item not found');
  }

  res.json(feedItem);
});

// Update an existing feed item (admin only)
const updateFeedItem = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only admins can update feed items');
  }

  const feedItem = await FeedItem.findById(req.params.id);

  if (!feedItem) {
    res.status(404);
    throw new Error('Feed item not found');
  }

  const { title, description, link, type, relevantDate } = req.body;

  // Validate description length if provided
  if (description && description.length < 20) {
    res.status(400);
    throw new Error('Description must be at least 20 characters long');
  }

  // Update fields if provided
  if (title !== undefined) feedItem.title = title;
  if (description !== undefined) feedItem.description = description;
  if (link !== undefined) feedItem.link = link;
  if (type !== undefined) feedItem.type = type;
  if (relevantDate !== undefined) feedItem.relevantDate = relevantDate;

  const updatedFeedItem = await feedItem.save();
  await updatedFeedItem.populate('postedBy', 'email');

  res.json(updatedFeedItem);
});

// Delete a feed item (admin only)
const deleteFeedItem = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only admins can delete feed items');
  }

  const feedItem = await FeedItem.findById(req.params.id);

  if (!feedItem) {
    res.status(404);
    throw new Error('Feed item not found');
  }

  await feedItem.deleteOne();

  res.json({ message: 'Feed item deleted successfully' });
});

export {
  createFeedItem,
  getAllFeedItems,
  getFeedItemById,
  updateFeedItem,
  deleteFeedItem,
}; 