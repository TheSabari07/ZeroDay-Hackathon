import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const API_URL = `${API_BASE_URL}/bookings`;

// Helper to get auth config
async function getConfig() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
}

// Create a new booking
async function createBooking(bookingData) {
  const config = await getConfig();
  const response = await axios.post(`${API_URL}/`, bookingData, config);
  return response.data;
}

// Get all bookings made by the authenticated user (as a student)
async function getUserBookings() {
  const config = await getConfig();
  const response = await axios.get(`${API_URL}/my-bookings`, config);
  return response.data;
}

// Get all bookings for skills offered by the authenticated user (as a tutor)
async function getTutorBookings() {
  const config = await getConfig();
  const response = await axios.get(`${API_URL}/tutor-bookings`, config);
  return response.data;
}

// Get a single booking by ID
async function getBookingById(id) {
  const config = await getConfig();
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
}

// Update booking status
async function updateBookingStatus(id, statusData) {
  const config = await getConfig();
  const response = await axios.put(`${API_URL}/status/${id}`, statusData, config);
  return response.data;
}

// Delete a booking
async function deleteBooking(id) {
  const config = await getConfig();
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
}

const bookingService = {
  createBooking,
  getUserBookings,
  getTutorBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
};

export default bookingService; 