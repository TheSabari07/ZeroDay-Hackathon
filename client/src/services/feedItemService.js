import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const API_URL = `${API_BASE_URL}/feed`;

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

// Create a new feed item
async function createFeedItem(itemData) {
  const config = await getConfig();
  const response = await axios.post(`${API_URL}/`, itemData, config);
  return response.data;
}

// Get all feed items with optional filtering and sorting
async function getAllFeedItems(params = {}) {
  const config = await getConfig();
  const response = await axios.get(`${API_URL}/`, { ...config, params });
  return response.data;
}

// Get a single feed item by ID
async function getFeedItemById(id) {
  const config = await getConfig();
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data;
}

// Update an existing feed item
async function updateFeedItem(id, updateData) {
  const config = await getConfig();
  const response = await axios.put(`${API_URL}/${id}`, updateData, config);
  return response.data;
}

// Delete a feed item
async function deleteFeedItem(id) {
  const config = await getConfig();
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
}

const feedItemService = {
  createFeedItem,
  getAllFeedItems,
  getFeedItemById,
  updateFeedItem,
  deleteFeedItem,
};

export default feedItemService; 