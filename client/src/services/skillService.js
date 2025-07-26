import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const API_URL = `${API_BASE_URL}/skills`;

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

// Create a new skill listing
async function createSkill(skillData) {
  const config = await getConfig();
  const response = await axios.post(`${API_URL}/`, skillData, config);
  return response.data;
}

// Get all skills with optional filtering and search
async function getAllSkills(params = {}) {
  const response = await axios.get(`${API_URL}/`, { params });
  return response.data;
}

// Get skills listed by the authenticated user
async function getUserSkills() {
  const config = await getConfig();
  const response = await axios.get(`${API_URL}/my`, config);
  return response.data;
}

// Get a single skill by ID
async function getSkillById(id) {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

// Update an existing skill
async function updateSkill(id, updateData) {
  const config = await getConfig();
  const response = await axios.put(`${API_URL}/${id}`, updateData, config);
  return response.data;
}

// Delete a skill
async function deleteSkill(id) {
  const config = await getConfig();
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
}

const skillService = {
  createSkill,
  getAllSkills,
  getUserSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};

export default skillService; 