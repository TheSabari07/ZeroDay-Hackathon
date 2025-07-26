import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  submitVote,
  checkUserVote,
} from '../controllers/voteController.js';

const router = express.Router();

// Student: submit a vote on a poll
router.post('/:id', protect, submitVote);

// Student and Admin: check if user has voted on a specific poll
router.get('/check/:id', protect, checkUserVote);

export default router; 