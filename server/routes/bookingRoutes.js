import express from 'express';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
import {
  createBooking,
  getUserBookings,
  getTutorBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/bookingController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create a new booking
router.post('/', createBooking); // Any authenticated user can create a booking

// Get user's own bookings (as a student)
router.get('/my-bookings', getUserBookings); // Authenticated user views their made bookings

// Get bookings for user's skills (as a tutor)
router.get('/tutor-bookings', getTutorBookings); // Authenticated user views bookings for their skills

// Get a specific booking by ID
router.get('/:id', getBookingById); // Involved student/tutor or Admin

// Update booking status
router.put('/status/:id', updateBookingStatus); // Involved student/tutor or Admin

// Delete a booking
router.delete('/:id', deleteBooking); // Student who booked it or Admin

export default router; 