import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const API_URL = `${API_BASE_URL}/auth`;

// Register a new user
async function register(userData) {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data && response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
}

// Login a user
async function login(userData) {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data && response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
}

// Logout a user
function logout() {
  localStorage.removeItem('user');
}

const authService = {
  register,
  login,
  logout,
};

export default authService;
