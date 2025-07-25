import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const API_URL = `${API_BASE_URL}/schedule`;

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

// Create a new schedule item
async function createScheduleItem(itemData) {
  const config = await getConfig();
  try {
    const res = await axios.post(`${API_URL}/`, itemData, config);
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || err.message || 'Failed to create schedule item.');
  }
}

// Get all schedule items for the authenticated user
async function getStudentSchedule() {
  const config = await getConfig();
  try {
    const res = await axios.get(`${API_URL}/my`, config);
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || err.message || 'Failed to load timetable.');
  }
}

// Get a single schedule item by id
async function getScheduleItemById(id) {
  const config = await getConfig();
  try {
    const res = await axios.get(`${API_URL}/${id}`, config);
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || err.message || 'Failed to load schedule item.');
  }
}

// Update a schedule item
async function updateScheduleItem(id, updateData) {
  const config = await getConfig();
  try {
    const res = await axios.put(`${API_URL}/${id}`, updateData, config);
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || err.message || 'Failed to update schedule item.');
  }
}

// Delete a schedule item
async function deleteScheduleItem(id) {
  const config = await getConfig();
  try {
    const res = await axios.delete(`${API_URL}/${id}`, config);
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || err.message || 'Failed to delete schedule item.');
  }
}

const scheduleService = {
  createScheduleItem,
  getStudentSchedule,
  getScheduleItemById,
  updateScheduleItem,
  deleteScheduleItem,
};

export default scheduleService; 