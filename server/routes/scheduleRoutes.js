import express from 'express';
import { 
  createScheduleItem,
  getStudentSchedule,
  getScheduleItemById,
  updateScheduleItem,
  deleteScheduleItem
} from '../controllers/scheduleController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new schedule item
router.post('/', protect, createScheduleItem);

// Get all schedule items for the authenticated user
router.get('/my', protect, getStudentSchedule);

// Get, update, or delete a schedule item by id
router.get('/:id', protect, getScheduleItemById);
router.put('/:id', protect, updateScheduleItem);
router.delete('/:id', protect, deleteScheduleItem);

export default router; 