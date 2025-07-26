import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
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
            
            {/* News & Updates Dropdown */}
            <div className="relative group">
              <button className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                isActive('/announcements') || isActive('/feed')
                  ? 'text-white bg-white/20 px-3 py-2 rounded-lg' 
                  : 'text-white/80 hover:text-white'
              }`}>
                News & Updates
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
                <div className="py-2">
                  <Link 
                    to="/announcements" 
                    className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                      isActive('/announcements')
                        ? 'text-indigo-600 bg-indigo-50 font-medium' 
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    📢 Campus Announcements
                  </Link>
                  <Link 
                    to="/feed" 
                    className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                      isActive('/feed')
                        ? 'text-indigo-600 bg-indigo-50 font-medium' 
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    🚀 Tech News & Opportunities
                  </Link>
                </div>
              </div>
            </div>
            
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
            
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link 
                to="/polls" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/polls') 
                    ? 'text-white bg-white/20 px-3 py-2 rounded-lg' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Polls
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
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

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white/95 backdrop-blur-md border-t border-white/20"
        >
          <div className="px-4 py-4 space-y-3">
            {/* Dashboard */}
            <Link 
              to="/dashboard" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive('/dashboard')
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              🏠 Dashboard
            </Link>

            {/* News & Updates */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                News & Updates
              </div>
              <Link 
                to="/announcements" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/announcements')
                    ? 'text-indigo-600 bg-indigo-50 font-medium' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                📢 Campus Announcements
              </Link>
              <Link 
                to="/feed" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/feed')
                    ? 'text-indigo-600 bg-indigo-50 font-medium' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                🚀 Tech News & Opportunities
              </Link>
            </div>

            {/* Academic */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Academic
              </div>
              <Link 
                to="/timetable" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/timetable')
                    ? 'text-indigo-600 bg-indigo-50 font-medium' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                📅 Timetable
              </Link>
            </div>

            {/* Campus Life */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Campus Life
              </div>
              <Link 
                to="/lostfound/browse" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/lostfound')
                    ? 'text-indigo-600 bg-indigo-50 font-medium' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                🔍 Lost & Found
              </Link>
              <Link 
                to="/skills/browse" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/skills/browse')
                    ? 'text-indigo-600 bg-indigo-50 font-medium' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                🎯 Browse Skills
              </Link>
              <Link 
                to="/polls" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/polls')
                    ? 'text-indigo-600 bg-indigo-50 font-medium' 
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                🗳️ Polls
              </Link>
            </div>

            {/* Student Services */}
            {user?.role === 'student' && (
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student Services
                </div>
                <Link 
                  to="/skills/my-listings" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    isActive('/skills/my-listings')
                      ? 'text-indigo-600 bg-indigo-50 font-medium' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  📋 My Skills
                </Link>
                <Link 
                  to="/skills/my-bookings" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    isActive('/skills/my-bookings')
                      ? 'text-indigo-600 bg-indigo-50 font-medium' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  🤝 My Sessions
                </Link>
                <Link 
                  to="/complaints/my" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    isActive('/complaints')
                      ? 'text-indigo-600 bg-indigo-50 font-medium' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  📝 Complaints
                </Link>
              </div>
            )}

            {/* Admin Panel */}
            {user?.role === 'admin' && (
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </div>
                <Link 
                  to="/admin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    isActive('/admin')
                      ? 'text-indigo-600 bg-indigo-50 font-medium' 
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  ⚙️ Admin Panel
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default NavBar; 