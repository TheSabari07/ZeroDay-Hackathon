const express = require('express');
const router = express.Router();
const { 
  createScheduleItem,
  getStudentSchedule,
  getScheduleItemById,
  updateScheduleItem,
  deleteScheduleItem
} = require('../controllers/scheduleController');
const { protect } = require('../middlewares/authMiddleware');

// Create a new schedule item
router.post('/', protect, createScheduleItem);

// Get all schedule items for the authenticated user
router.get('/my', protect, getStudentSchedule);

// Get, update, or delete a schedule item by id
router.get('/:id', protect, getScheduleItemById);
router.put('/:id', protect, updateScheduleItem);
router.delete('/:id', protect, deleteScheduleItem);

module.exports = router; 