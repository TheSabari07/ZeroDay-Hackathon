import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const API_URL = `${API_BASE_URL}/votes`;

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

// Submit a vote on a poll
async function submitVote(pollId, selectedOption) {
  const config = await getConfig();
  const response = await axios.post(`${API_URL}/${pollId}`, { selectedOption }, config);
  return response.data;
}

// Check if user has voted on a specific poll
async function checkUserVote(pollId) {
  const config = await getConfig();
  const response = await axios.get(`${API_URL}/check/${pollId}`, config);
  return response.data;
}

const voteService = {
  submitVote,
  checkUserVote,
};

export default voteService; 