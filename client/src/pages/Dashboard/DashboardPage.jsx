import React from 'react';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to Dashboard!</h1>
      <button
        onClick={logout}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
