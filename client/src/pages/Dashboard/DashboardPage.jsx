import React from 'react';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] max-w-4xl mx-auto p-8 glass-card animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-slide-in">Welcome to Dashboard!</h1>
      <button
        onClick={logout}
        className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white py-2 px-6 rounded-md font-semibold hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-200 ease-in-out mt-6"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
