import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const API_URL = `${API_BASE_URL}/polls`;

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

// Create a new poll
async function createPoll(pollData) {
  const config = await getConfig();
  const response = await axios.post(`${API_URL}/`, pollData, config);
  return response.data;
}

// Get all polls
async function getAllPolls() {
  const config = await getConfig();
  const response = await axios.get(`${API_URL}/`, config);
  return response.data;
}

// Get a single poll by ID
async function getPollById(id) {
  const config = await getConfig();
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
}

// Update a poll
async function updatePoll(id, updateData) {
  const config = await getConfig();
  const response = await axios.put(`${API_URL}/${id}`, updateData, config);
  return response.data;
}

// Delete a poll
async function deletePoll(id) {
  const config = await getConfig();
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
}

const pollService = {
  createPoll,
  getAllPolls,
  getPollById,
  updatePoll,
  deletePoll,
};

export default pollService; 