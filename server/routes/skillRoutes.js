import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  createSkill,
  getAllSkills,
  getUserSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';

const router = express.Router();

// Public routes
router.get('/', getAllSkills); // Publicly viewable - anyone can browse skills

// Protected routes (specific routes first)
router.get('/my', protect, getUserSkills); // Authenticated user gets their own skills

// Dynamic routes (after specific routes)
router.get('/:id', getSkillById); // Publicly viewable - anyone can view skill details

// Protected routes with authorization
router.post('/', protect, createSkill); // Any authenticated user can create a skill
router.put('/:id', protect, updateSkill); // User who listed it or Admin
router.delete('/:id', protect, deleteSkill); // User who listed it or Admin

export default router; 