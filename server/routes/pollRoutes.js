import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  createPoll,
  getAllPolls,
  getPollById,
  updatePoll,
  deletePoll,
} from '../controllers/pollController.js';

const router = express.Router();

// Admin only: create poll
router.post('/', protect, authorizeRoles('admin'), createPoll);

// Student and Admin: get all polls
router.get('/', protect, getAllPolls);

// Student and Admin: get single poll
router.get('/:id', protect, getPollById);

// Admin only: update poll
router.put('/:id', protect, authorizeRoles('admin'), updatePoll);

// Admin only: delete poll
router.delete('/:id', protect, authorizeRoles('admin'), deletePoll);

export default router; 