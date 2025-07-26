import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import bookingService from '../../services/bookingService';

const MyBookingsPage = () => {
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

  // Get status color for styling
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Accepted': 'bg-blue-100 text-blue-800 border-blue-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Format date for display
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render booking card
  const renderBookingCard = (booking, isTutorView = false) => {
    const isUpdating = updatingBookings.has(booking._id);

    return (
      <motion.div
        key={booking._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        {/* Header with Skill Info */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {booking.skill?.title || 'Unknown Skill'}
            </h3>
            <p className="text-sm text-gray-600">
              {isTutorView ? 'Student: ' : 'Tutor: '}
              {isTutorView ? booking.student?.email : booking.tutor?.email}
            </p>
          </div>
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        {/* Booking Details */}
        <div className="space-y-2 mb-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Proposed Time:</span>
            <p className="text-sm text-gray-700">{formatDateTime(booking.proposedDateTime)}</p>
          </div>
          
          {booking.message && (
            <div>
              <span className="text-sm font-medium text-gray-500">Message:</span>
              <p className="text-sm text-gray-700">{booking.message}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
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
                    className="btn-success text-sm px-3 py-2 disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Accept'}
                  </motion.button>
                  <motion.button
                    onClick={() => handleStatusUpdate(booking._id, 'Rejected')}
                    disabled={isUpdating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-danger text-sm px-3 py-2 disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Reject'}
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
                    className="btn-success text-sm px-3 py-2 disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Mark Completed'}
                  </motion.button>
                  <motion.button
                    onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                    disabled={isUpdating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary text-sm px-3 py-2 disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Cancel'}
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
                  className="btn-secondary text-sm px-3 py-2 disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Cancel Booking'}
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center py-12"
          >
            <p className="text-red-600 text-lg mb-4">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-xl text-white/90">
            Manage your skill sharing sessions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bookings I Made (Student View) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Bookings I Made</h2>
              
              {myBookingsAsStudent.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
                  <motion.button
                    onClick={() => window.location.href = '/skills'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    Browse Skills
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
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
            <div className="glass-card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Bookings for My Skills</h2>
              
              {myBookingsAsTutor.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No one has booked your skills yet.</p>
                  <motion.button
                    onClick={() => window.location.href = '/skills/list'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    List a Skill
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBookingsAsTutor.map(booking => renderBookingCard(booking, true))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Refresh Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <motion.button
            onClick={fetchBookings}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary"
          >
            Refresh Bookings
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default MyBookingsPage; 