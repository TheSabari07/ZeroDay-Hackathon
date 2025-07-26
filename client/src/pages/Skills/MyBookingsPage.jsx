import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';

const MyBookingsPage = () => {
  const navigate = useNavigate();
  
  // State for bookings data
  const [myBookingsAsStudent, setMyBookingsAsStudent] = useState([]);
  const [myBookingsAsTutor, setMyBookingsAsTutor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for individual booking actions
  const [updatingBookings, setUpdatingBookings] = useState(new Set());

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch both types of bookings in parallel
      const [studentBookings, tutorBookings] = await Promise.all([
        bookingService.getUserBookings(),
        bookingService.getTutorBookings()
      ]);

      setMyBookingsAsStudent(studentBookings);
      setMyBookingsAsTutor(tutorBookings);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle booking status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingBookings(prev => new Set(prev).add(bookingId));

    try {
      await bookingService.updateBookingStatus(bookingId, { status: newStatus });
      
      // Refresh bookings after update
      await fetchBookings();
    } catch (err) {
      console.error('Failed to update booking status:', err);
      // You could add a toast notification here
    } finally {
      setUpdatingBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  // Get status color and icon for styling
  const getStatusInfo = (status) => {
    const statusConfig = {
      'Pending': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '⏳',
        bgGradient: 'from-yellow-400 to-orange-400'
      },
      'Accepted': {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '✅',
        bgGradient: 'from-blue-400 to-cyan-400'
      },
      'Rejected': {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: '❌',
        bgGradient: 'from-red-400 to-pink-400'
      },
      'Completed': {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '🎉',
        bgGradient: 'from-green-400 to-emerald-400'
      },
      'Cancelled': {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '🚫',
        bgGradient: 'from-gray-400 to-slate-400'
      }
    };
    return statusConfig[status] || statusConfig['Pending'];
  };

  // Format date for display
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const timeString = date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (diffDays < 0) {
      return `${timeString} (Past)`;
    } else if (diffDays === 0) {
      return `${timeString} (Today)`;
    } else if (diffDays === 1) {
      return `${timeString} (Tomorrow)`;
    } else if (diffDays <= 7) {
      return `${timeString} (In ${diffDays} days)`;
    } else {
      return timeString;
    }
  };

  // Get time status for styling
  const getTimeStatus = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'past';
    if (diffDays === 0) return 'today';
    if (diffDays <= 3) return 'soon';
    return 'future';
  };

  // Render booking card
  const renderBookingCard = (booking, isTutorView = false) => {
    const isUpdating = updatingBookings.has(booking._id);
    const statusInfo = getStatusInfo(booking.status);
    const timeStatus = getTimeStatus(booking.proposedDateTime);

    return (
      <motion.div
        key={booking._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="glass-card p-6 border-2 border-white/20 hover:border-white/30 transition-all duration-200"
      >
        {/* Header with Skill Info and Status */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${statusInfo.bgGradient} flex items-center justify-center text-white text-lg`}>
                {statusInfo.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {booking.skill?.title || 'Unknown Skill'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isTutorView ? 'Student: ' : 'Tutor: '}
                  <span className="font-medium">{isTutorView ? booking.student?.email : booking.tutor?.email}</span>
                </p>
              </div>
            </div>
          </div>
          <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full border-2 ${statusInfo.color}`}>
            {booking.status}
          </span>
        </div>

        {/* Booking Details */}
        <div className="space-y-4 mb-6">
          <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">📅</span>
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Session Time</span>
            </div>
            <p className={`text-lg font-semibold ${
              timeStatus === 'past' ? 'text-gray-500' :
              timeStatus === 'today' ? 'text-orange-600' :
              timeStatus === 'soon' ? 'text-blue-600' : 'text-gray-700'
            }`}>
              {formatDateTime(booking.proposedDateTime)}
            </p>
          </div>
          
          {booking.message && (
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">💬</span>
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Message</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{booking.message}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          {isTutorView ? (
            // Tutor actions
            <>
              {booking.status === 'Pending' && (
                <>
                  <motion.button
                    onClick={() => handleStatusUpdate(booking._id, 'Accepted')}
                    disabled={isUpdating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-success px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <span>✅</span>
                        <span>Accept</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => handleStatusUpdate(booking._id, 'Rejected')}
                    disabled={isUpdating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-danger px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <span>❌</span>
                        <span>Reject</span>
                      </>
                    )}
                  </motion.button>
                </>
              )}
              
              {booking.status === 'Accepted' && (
                <>
                  <motion.button
                    onClick={() => handleStatusUpdate(booking._id, 'Completed')}
                    disabled={isUpdating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-success px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <span>🎉</span>
                        <span>Mark Completed</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                    disabled={isUpdating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <span>🚫</span>
                        <span>Cancel</span>
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </>
          ) : (
            // Student actions
            <>
              {(booking.status === 'Pending' || booking.status === 'Accepted') && (
                <motion.button
                  onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                  disabled={isUpdating}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary px-6 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span>🚫</span>
                      <span>Cancel Booking</span>
                    </>
                  )}
                </motion.button>
              )}
            </>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading Your Sessions</h2>
            <p className="text-white/80">Fetching your booking information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center py-12 max-w-md mx-auto"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <motion.button
              onClick={fetchBookings}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🤝</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">My Sessions</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Manage your skill sharing sessions and track your learning journey
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">{myBookingsAsStudent.length}</div>
            <div className="text-white/80 text-sm">Bookings Made</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">{myBookingsAsTutor.length}</div>
            <div className="text-white/80 text-sm">Received Requests</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {myBookingsAsStudent.filter(b => b.status === 'Completed').length + 
               myBookingsAsTutor.filter(b => b.status === 'Completed').length}
            </div>
            <div className="text-white/80 text-sm">Completed Sessions</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {myBookingsAsStudent.filter(b => b.status === 'Pending').length + 
               myBookingsAsTutor.filter(b => b.status === 'Pending').length}
            </div>
            <div className="text-white/80 text-sm">Pending Actions</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Bookings I Made (Student View) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Learning Sessions</h2>
                  <p className="text-gray-600">Bookings you've made to learn from others</p>
                </div>
              </div>
              
              {myBookingsAsStudent.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Learning Sessions Yet</h3>
                  <p className="text-gray-600 mb-6">Start your learning journey by booking a skill session!</p>
                  <motion.button
                    onClick={() => navigate('/skills/browse')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    Browse Skills
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-6">
                  {myBookingsAsStudent.map(booking => renderBookingCard(booking, false))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Bookings for My Skills (Tutor View) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Teaching Sessions</h2>
                  <p className="text-gray-600">Requests from students to learn from you</p>
                </div>
              </div>
              
              {myBookingsAsTutor.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Teaching Requests Yet</h3>
                  <p className="text-gray-600 mb-6">List your skills to start receiving booking requests!</p>
                  <motion.button
                    onClick={() => navigate('/skills/list')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    List a Skill
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-6">
                  {myBookingsAsTutor.map(booking => renderBookingCard(booking, true))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={fetchBookings}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-3"
            >
              🔄 Refresh Sessions
            </motion.button>
            <motion.button
              onClick={() => navigate('/skills/browse')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-3"
            >
              🎯 Browse More Skills
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyBookingsPage; 