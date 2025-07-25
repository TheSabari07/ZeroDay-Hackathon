import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const API_URL = `${API_BASE_URL}/announcements`;

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

// Create a new announcement
async function createAnnouncement(announcementData) {
  const config = await getConfig();
  const response = await axios.post(`${API_URL}/`, announcementData, config);
  return response.data;
}

// Get all announcements (with optional params)
async function getAnnouncements(params = {}) {
  const config = await getConfig();
  const response = await axios.get(`${API_URL}/`, { ...config, params });
  return response.data;
}

// Get a single announcement by ID
async function getAnnouncementById(id) {
  const config = await getConfig();
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
}

// Update an announcement
async function updateAnnouncement(id, updateData) {
  const config = await getConfig();
  const response = await axios.put(`${API_URL}/${id}`, updateData, config);
  return response.data;
}

// Delete an announcement
async function deleteAnnouncement(id) {
  const config = await getConfig();
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
}

const announcementService = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};

export default announcementService; 