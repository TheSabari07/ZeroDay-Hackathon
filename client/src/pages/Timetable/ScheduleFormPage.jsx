import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import scheduleService from '../../services/scheduleService';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const ScheduleFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [instructor, setInstructor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      scheduleService.getScheduleItemById(id)
        .then(item => {
          setCourseName(item.courseName || '');
          setCourseCode(item.courseCode || '');
          setDayOfWeek(item.dayOfWeek || 'Monday');
          setStartTime(item.startTime || '');
          setEndTime(item.endTime || '');
          setLocation(item.location || '');
          setInstructor(item.instructor || '');
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate time range (8:00 to 16:00)
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    if (startHour < 8 || startHour >= 16) {
      setError('Start time must be between 8:00 AM and 4:00 PM');
      setLoading(false);
      return;
    }
    
    if (endHour < 8 || endHour > 16) {
      setError('End time must be between 8:00 AM and 4:00 PM');
      setLoading(false);
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time');
      setLoading(false);
      return;
    }

    const itemData = {
      courseName,
      courseCode,
      dayOfWeek,
      startTime,
      endTime,
      location,
      instructor,
    };
    
    try {
      if (id) {
        await scheduleService.updateScheduleItem(id, itemData);
        setSuccess('Schedule item updated successfully!');
      } else {
        await scheduleService.createScheduleItem(itemData);
        setSuccess('Schedule item created successfully!');
      }
      setTimeout(() => {
        navigate('/timetable', { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
      <motion.div 
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            {id ? 'Edit Class' : 'Add New Class'}
          </h1>
          <p className="text-lg text-white/90">
            {id ? 'Update your class information' : 'Schedule a new class or meeting'}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          className="glass-card p-8"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  placeholder="e.g., Advanced Mathematics"
                  required
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
                  value={courseCode}
                  onChange={e => setCourseCode(e.target.value)}
                  placeholder="e.g., MATH101"
                  required
                />
              </motion.div>
            </div>

            {/* Schedule Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day of Week <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
                  value={dayOfWeek}
                  onChange={e => setDayOfWeek(e.target.value)}
                  required
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  min="08:00"
                  max="15:00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Between 8:00 AM - 4:00 PM</p>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  min="08:00"
                  max="16:00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Between 8:00 AM - 4:00 PM</p>
              </motion.div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g., Room 201, Main Building"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
                  value={instructor}
                  onChange={e => setInstructor(e.target.value)}
                  placeholder="e.g., Dr. Smith"
                />
              </motion.div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 rounded-lg p-4"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <div className="text-red-500 mr-3">⚠️</div>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
            
            {success && (
              <motion.div 
                className="bg-green-50 border border-green-200 rounded-lg p-4"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <div className="text-green-500 mr-3">✅</div>
                  <p className="text-green-700 font-medium">{success}</p>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div 
              className="flex gap-4 pt-4"
              variants={itemVariants}
            >
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {id ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {id ? '📝 Update Class' : '➕ Create Class'}
                  </div>
                )}
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/timetable')}
                className="px-6 py-3 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                disabled={loading}
              >
                Cancel
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Time Range Info */}
        <motion.div 
          className="mt-6 text-center"
          variants={itemVariants}
        >
          <div className="glass-card p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center text-white/80">
              <div className="text-2xl mr-3">⏰</div>
              <div className="text-left">
                <p className="font-medium">Available Time Range</p>
                <p className="text-sm">8:00 AM - 4:00 PM (Monday to Sunday)</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ScheduleFormPage; 