import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import skillService from '../../services/skillService';
import bookingService from '../../services/bookingService';

const SkillDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for skill data
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for booking form
  const [bookingData, setBookingData] = useState({
    proposedDateTime: '',
    message: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Fetch skill details
  const fetchSkill = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await skillService.getSkillById(id);
      setSkill(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch skill details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch skill on mount
  useEffect(() => {
    fetchSkill();
  }, [id]);

  // Handle booking form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');

    try {
      // Validate required fields
      if (!bookingData.proposedDateTime) {
        throw new Error('Please select a date and time for the session');
      }

      // Validate future date
      const proposedDate = new Date(bookingData.proposedDateTime);
      if (proposedDate <= new Date()) {
        throw new Error('Please select a future date and time');
      }

      const bookingPayload = {
        skillId: skill._id,
        proposedDateTime: bookingData.proposedDateTime,
        message: bookingData.message.trim()
      };

      await bookingService.createBooking(bookingPayload);
      
      setBookingSuccess('Booking request sent successfully!');
      setBookingData({ proposedDateTime: '', message: '' });
      
      // Redirect to user's bookings after a delay
      setTimeout(() => {
        navigate('/bookings/my-bookings');
      }, 2000);

    } catch (err) {
      setBookingError(err.response?.data?.message || err.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle skill deletion
  const handleDeleteSkill = async () => {
    if (!window.confirm('Are you sure you want to delete this skill? This action cannot be undone.')) {
      return;
    }

    try {
      await skillService.deleteSkill(id);
      navigate('/skills/my');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete skill');
    }
  };

  // Get category color for styling
  const getCategoryColor = (category) => {
    const colors = {
      'Coding': 'from-blue-500 to-blue-600',
      'Design': 'from-purple-500 to-purple-600',
      'Languages': 'from-green-500 to-green-600',
      'Academics': 'from-yellow-500 to-yellow-600',
      'Music': 'from-pink-500 to-pink-600',
      'Sports': 'from-orange-500 to-orange-600',
      'Other': 'from-gray-500 to-gray-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  // Get level color for styling
  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  // Check if current user is the skill owner
  const isOwner = user && skill && skill.user?._id === user._id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading skill details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center py-12"
          >
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={fetchSkill}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Try Again
              </motion.button>
              <motion.button
                onClick={() => navigate('/skills')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                Back to Skills
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center py-12"
          >
            <p className="text-gray-600 text-lg mb-4">Skill not found</p>
            <motion.button
              onClick={() => navigate('/skills')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Back to Skills
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Skill Details</h1>
          <p className="text-xl text-white/90">
            Learn more about this skill offering
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Skill Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card"
          >
            {/* Category and Level Badges */}
            <div className="flex justify-between items-start mb-6">
              <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r ${getCategoryColor(skill.category)} text-white`}>
                {skill.category}
              </span>
              <span className={`inline-block px-3 py-2 text-sm font-medium rounded-full ${getLevelColor(skill.level)}`}>
                {skill.level}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {skill.title}
            </h2>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {skill.description}
              </p>
            </div>

            {/* Availability */}
            {skill.availability && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Availability</h3>
                <p className="text-gray-600">{skill.availability}</p>
              </div>
            )}

            {/* Tutor Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Tutor</h3>
              <p className="text-gray-600">{skill.user?.email || 'Unknown'}</p>
            </div>

            {/* Contact Method */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Contact Method</h3>
              <p className="text-gray-600">{skill.contactMethod}</p>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Manage Your Skill</h3>
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => navigate(`/skills/edit/${id}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    Edit Skill
                  </motion.button>
                  <motion.button
                    onClick={handleDeleteSkill}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-danger"
                  >
                    Delete Skill
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Booking Form or Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card"
          >
            {isOwner ? (
              // Owner view - show booking requests
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Skill</h3>
                <p className="text-gray-600 mb-6">
                  This is your skill listing. You can edit or delete it using the buttons on the left.
                </p>
                <motion.button
                  onClick={() => navigate('/bookings/tutor-bookings')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary w-full"
                >
                  View Booking Requests
                </motion.button>
              </div>
            ) : (
              // Student view - show booking form
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Book This Skill</h3>
                
                {/* Booking Success Message */}
                {bookingSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
                  >
                    {bookingSuccess}
                  </motion.div>
                )}

                {/* Booking Error Message */}
                {bookingError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
                  >
                    {bookingError}
                  </motion.div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  {/* Proposed Date/Time */}
                  <div>
                    <label htmlFor="proposedDateTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Proposed Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="proposedDateTime"
                      value={bookingData.proposedDateTime}
                      onChange={(e) => setBookingData({ ...bookingData, proposedDateTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      value={bookingData.message}
                      onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Tell the tutor about your learning goals or any specific requirements..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={bookingLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending Request...
                      </div>
                    ) : (
                      'Book Session'
                    )}
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <motion.button
            onClick={() => navigate('/skills')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary"
          >
            Back to Skills
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default SkillDetailsPage; 