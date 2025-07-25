import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const API_URL = `${API_BASE_URL}/lostfound`;

// Helper to get auth config
async function getConfig() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
}

// Create item (with FormData, for image upload)
async function createItem(formData) {
  const config = await getConfig();
  // Ensure multipart/form-data for FormData
  config.headers = {
    ...config.headers,
    "Content-Type": "multipart/form-data",
  };
  const res = await axios.post(`${API_URL}/`, formData, config);
  return res.data;
}

// Get all items (with optional filters)
async function getAllItems(params = {}) {
  const config = await getConfig();
  config.params = params;
  const res = await axios.get(`${API_URL}/`, config);
  return res.data;
}

// Get item by ID
async function getItemById(id) {
  const config = await getConfig();
  const res = await axios.get(`${API_URL}/${id}`, config);
  return res.data;
}

// Update item (with FormData)
async function updateItem(id, formData) {
  const config = await getConfig();
  config.headers = {
    ...config.headers,
    "Content-Type": "multipart/form-data",
  };
  const res = await axios.put(`${API_URL}/${id}`, formData, config);
  return res.data;
}

// Update item status (admin only)
async function updateItemStatus(id, statusData) {
  const config = await getConfig();
  const res = await axios.put(`${API_URL}/status/${id}`, statusData, config);
  return res.data;
}

// Delete item
async function deleteItem(id) {
  const config = await getConfig();
  const res = await axios.delete(`${API_URL}/${id}`, config);
  return res.data;
}

const lostFoundService = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  updateItemStatus,
  deleteItem,
};

export default lostFoundService; 