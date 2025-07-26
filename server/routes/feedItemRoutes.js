import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  createFeedItem,
  getAllFeedItems,
  getFeedItemById,
  updateFeedItem,
  deleteFeedItem,
} from '../controllers/feedItemController.js';

const router = express.Router();

// Admin only: create feed item
router.post('/', protect, authorizeRoles('admin'), createFeedItem);

// Public: get all feed items (publicly viewable)
router.get('/', getAllFeedItems);

// Public: get single feed item (publicly viewable)
router.get('/:id', getFeedItemById);

// Admin only: update feed item
router.put('/:id', protect, authorizeRoles('admin'), updateFeedItem);

// Admin only: delete feed item
router.delete('/:id', protect, authorizeRoles('admin'), deleteFeedItem);

export default router; 