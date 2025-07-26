import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-white/20 backdrop-blur-md shadow-lg border-b border-white/30 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="font-bold text-xl text-gradient">ZeroDay</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/dashboard') 
                    ? 'text-white bg-white/20 px-3 py-2 rounded-lg' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/announcements" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/announcements') 
                    ? 'text-white bg-white/20 px-3 py-2 rounded-lg' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Announcements
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/timetable" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/timetable') 
                    ? 'text-white bg-white/20 px-3 py-2 rounded-lg' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Timetable
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/lostfound/browse" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/lostfound') 
                    ? 'text-white bg-white/20 px-3 py-2 rounded-lg' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Lost & Found
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/skills/browse" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/skills/browse') 
                    ? 'text-white bg-white/20 px-3 py-2 rounded-lg' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Browse Skills
              </Link>
            </motion.div>
            
            {user?.role === 'student' && (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    to="/skills/my-listings" 
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive('/skills/my-listings') 
                        ? 'text-white bg-white/20 px-3 py-2 rounded-lg' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    My Skills
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    to="/skills/my-bookings" 
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive('/skills/my-bookings') 
                        ? 'text-white bg-white/20 px-3 py-2 rounded-lg' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    My Sessions
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    to="/complaints/my" 
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive('/complaints') 
                        ? 'text-white bg-white/20 px-3 py-2 rounded-lg' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Complaints
                  </Link>
                </motion.div>
              </>
            )}
            
            {user?.role === 'admin' && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link 
                  to="/admin" 
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/admin') 
                      ? 'text-white bg-white/20 px-3 py-2 rounded-lg' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Admin Panel
                </Link>
              </motion.div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-white/70 capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 backdrop-blur-md border border-white/30"
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar; 