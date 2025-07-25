import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} from '../controllers/complaintController.js';

const router = express.Router();

// Create a complaint (Student and Admin)
router.post('/', protect, createComplaint);

// Get complaints for the current user (Student and Admin)
router.get('/my', protect, getUserComplaints);

// Get all complaints (Admin only)
router.get('/admin', protect, authorizeRoles('admin'), getAllComplaints);

// Get a single complaint by ID (User who owns it or Admin)
router.get('/:id', protect, getComplaintById);

// Update complaint status (Admin only)
router.put('/status/:id', protect, authorizeRoles('admin'), updateComplaintStatus);

// Delete a complaint (User who owns it or Admin)
router.delete('/:id', protect, deleteComplaint);

export default router; 