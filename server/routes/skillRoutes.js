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
router.get('/:id', getSkillById); // Publicly viewable - anyone can view skill details

// Protected routes
router.post('/', protect, createSkill); // Any authenticated user can create a skill
router.get('/my', protect, getUserSkills); // Authenticated user gets their own skills

// Protected routes with authorization
router.put('/:id', protect, updateSkill); // User who listed it or Admin
router.delete('/:id', protect, deleteSkill); // User who listed it or Admin

export default router; 