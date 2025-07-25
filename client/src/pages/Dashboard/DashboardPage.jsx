import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] max-w-4xl mx-auto p-8 glass-card animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-slide-in">Welcome to Dashboard!</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Link
          to="/announcements"
          className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white py-2 px-6 rounded-md font-semibold shadow hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-200 text-center"
        >
          View Campus Announcements
        </Link>
        {/* Lost & Found Buttons */}
        <Link
          to="/lostfound/report"
          className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white py-2 px-6 rounded-md font-semibold shadow hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition duration-200 text-center"
        >
          Report Lost/Found Item
        </Link>
        <Link
          to="/lostfound/browse"
          className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 text-white py-2 px-6 rounded-md font-semibold shadow hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition duration-200 text-center"
        >
          Browse Lost & Found Items
        </Link>
        {user?.role === 'admin' && (
          <Link
            to="/admin/announcements"
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white py-2 px-6 rounded-md font-semibold shadow hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition duration-200 text-center"
          >
            Manage Announcements
          </Link>
        )}
        {user?.role === 'student' && (
          <>
            <Link
              to="/complaints/register"
              className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white py-2 px-6 rounded-md font-semibold shadow hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-200 text-center"
            >
              Raise a Complaint
            </Link>
            <Link
              to="/complaints/my"
              className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white py-2 px-6 rounded-md font-semibold shadow hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200 text-center"
            >
              My Complaints
            </Link>
          </>
        )}
        {user?.role === 'admin' && (
          <Link
            to="/admin/complaints"
            className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 text-white py-2 px-6 rounded-md font-semibold shadow hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition duration-200 text-center"
          >
            Manage All Complaints
          </Link>
        )}
      </div>
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
