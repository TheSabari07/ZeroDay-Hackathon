import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const API_URL = `${API_BASE_URL}/complaints`;

// Helper to get auth config
async function getConfig() {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
}

const createComplaint = async (complaintData) => {
  const config = await getConfig();
  const res = await axios.post(`${API_URL}/`, complaintData, config);
  return res.data;
};

const getUserComplaints = async () => {
  const config = await getConfig();
  const res = await axios.get(`${API_URL}/my`, config);
  return res.data;
};

const getAllComplaints = async (params = {}) => {
  const config = await getConfig();
  const res = await axios.get(`${API_URL}/admin`, { ...config, params });
  return res.data;
};

const getComplaintById = async (id) => {
  const config = await getConfig();
  const res = await axios.get(`${API_URL}/${id}`, config);
  return res.data;
};

const updateComplaintStatus = async (id, statusData) => {
  const config = await getConfig();
  const res = await axios.put(`${API_URL}/status/${id}`, statusData, config);
  return res.data;
};

const deleteComplaint = async (id) => {
  const config = await getConfig();
  const res = await axios.delete(`${API_URL}/${id}`, config);
  return res.data;
};

const complaintService = {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
};

export default complaintService; 