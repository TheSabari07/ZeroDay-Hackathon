import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';

const router = express.Router();

// Admin only: create announcement
router.post('/', protect, authorizeRoles('admin'), createAnnouncement);

// Student and Admin: get all announcements
router.get('/', protect, getAnnouncements);

// Student and Admin: get single announcement
router.get('/:id', protect, getAnnouncementById);

// Admin only (controller also checks author): update announcement
router.put('/:id', protect, authorizeRoles('admin'), updateAnnouncement);

// Admin only (controller also checks author): delete announcement
router.delete('/:id', protect, authorizeRoles('admin'), deleteAnnouncement);

export default router; 