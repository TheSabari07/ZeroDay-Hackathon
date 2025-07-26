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
      'Beginner': 'bg-green-100 text-green-800 border-green-200',
      'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Advanced': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
  };



  // Check if current user is the skill owner
  const isOwner = user && skill && skill.user?._id === user._id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
            <p className="text-white text-xl font-medium">Loading skill details...</p>
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
            className="glass-card text-center py-16"
          >
            <div className="text-6xl mb-6">⚠️</div>
            <p className="text-red-600 text-xl font-medium mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={fetchSkill}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
              >
                Try Again
              </motion.button>
              <motion.button
                onClick={() => navigate('/skills/browse')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
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
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center py-16"
          >
            <div className="text-6xl mb-6">🔍</div>
            <p className="text-gray-600 text-xl font-medium mb-6">Skill not found</p>
            <motion.button
              onClick={() => navigate('/skills/browse')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
            >
              Back to Skills
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-5xl font-bold text-white mb-3">Skill Details</h1>
          <p className="text-xl text-white/90 font-medium">
            Learn more about this skill offering
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skill Information - Takes 2 columns on large screens */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <div className="glass-card p-8">
                             {/* Header with Category and Level */}
               <div className="flex items-start justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <div>
                     <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r ${getCategoryColor(skill.category)} text-white shadow-lg`}>
                       {skill.category}
                     </span>
                   </div>
                 </div>
                <span className={`inline-block px-4 py-2 text-sm font-medium rounded-full border ${getLevelColor(skill.level)} shadow-sm`}>
                  {skill.level}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
                {skill.title}
              </h2>

                             {/* Description */}
               <div className="mb-8">
                 <h3 className="text-xl font-semibold text-gray-700 mb-3">
                   Description
                 </h3>
                <div className="bg-white/50 rounded-lg p-6 backdrop-blur-sm">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {skill.description}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                 {/* Availability */}
                 {skill.availability && (
                   <div className="bg-white/30 rounded-lg p-6 backdrop-blur-sm">
                     <h3 className="text-lg font-semibold text-gray-700 mb-2">
                       Availability
                     </h3>
                    <p className="text-gray-700">{skill.availability}</p>
                  </div>
                )}

                                 {/* Contact Method */}
                 <div className="bg-white/30 rounded-lg p-6 backdrop-blur-sm">
                   <h3 className="text-lg font-semibold text-gray-700 mb-2">
                     Contact Method
                   </h3>
                  <p className="text-gray-700">{skill.contactMethod}</p>
                </div>
              </div>

                             {/* Tutor Information */}
               <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
                 <h3 className="text-lg font-semibold text-gray-700 mb-3">
                   Tutor Information
                 </h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {skill.user?.email?.charAt(0)?.toUpperCase() || 'T'}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{skill.user?.email || 'Unknown'}</p>
                    <p className="text-gray-600 text-sm">Skill Provider</p>
                  </div>
                </div>
              </div>

              {/* Owner Actions */}
              {isOwner && (
                <motion.div 
                  className="border-t border-gray-200 pt-8 mt-8"
                  variants={itemVariants}
                >
                                   <h3 className="text-xl font-semibold text-gray-700 mb-6">
                   Manage Your Skill
                 </h3>
                  <div className="flex gap-4">
                    <motion.button
                      onClick={() => navigate(`/skills/edit/${id}`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      ✏️ Edit Skill
                    </motion.button>
                    <motion.button
                      onClick={handleDeleteSkill}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      🗑️ Delete Skill
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Booking Form or Info - Takes 1 column on large screens */}
          <motion.div
            className="lg:col-span-1"
            variants={itemVariants}
          >
            <div className="glass-card p-6 sticky top-8">
              {isOwner ? (
                // Owner view - show booking requests
                <div>
                                       <h3 className="text-2xl font-bold text-gray-800 mb-4">
                       Your Skill
                     </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    This is your skill listing. You can edit or delete it using the buttons on the left.
                  </p>
                  <motion.button
                    onClick={() => navigate('/bookings/tutor-bookings')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    📊 View Booking Requests
                  </motion.button>
                </div>
              ) : (
                // Student view - show booking form
                <div>
                                       <h3 className="text-2xl font-bold text-gray-800 mb-6">
                       Book This Skill
                     </h3>
                  
                  {/* Booking Success Message */}
                  {bookingSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
                    >
                      <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        {bookingSuccess}
                      </div>
                    </motion.div>
                  )}

                  {/* Booking Error Message */}
                  {bookingError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
                    >
                      <div className="flex items-center">
                        <span className="mr-2">⚠️</span>
                        {bookingError}
                      </div>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white/70 backdrop-blur-sm"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none bg-white/70 backdrop-blur-sm"
                        placeholder="Tell the tutor about your learning goals or any specific requirements..."
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={bookingLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          </motion.div>
        </div>

        {/* Back Button */}
        <motion.div
          className="text-center mt-8"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => navigate('/skills/browse')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/30"
          >
            ← Back to Skills
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SkillDetailsPage; 