import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
];

// Helper to convert HH:MM to minutes
function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// Helper to check if a time is within a slot (overlap)
function isInSlot(start, end, slot) {
  const slotStart = timeToMinutes(slot);
  const slotEnd = slotStart + 60; // 1 hour slot
  const classStart = timeToMinutes(start);
  const classEnd = timeToMinutes(end);
  // Return true if the slot and class overlap
  return classStart < slotEnd && classEnd > slotStart;
}

// Generate a color for each class
const colorPalette = [
  'bg-gradient-to-br from-blue-400 to-blue-600',
  'bg-gradient-to-br from-green-400 to-green-600',
  'bg-gradient-to-br from-purple-400 to-purple-600',
  'bg-gradient-to-br from-pink-400 to-pink-600',
  'bg-gradient-to-br from-indigo-400 to-indigo-600',
  'bg-gradient-to-br from-orange-400 to-orange-600',
  'bg-gradient-to-br from-teal-400 to-teal-600',
  'bg-gradient-to-br from-red-400 to-red-600',
  'bg-gradient-to-br from-yellow-400 to-yellow-600',
  'bg-gradient-to-br from-emerald-400 to-emerald-600',
];

function getColor(index) {
  return colorPalette[index % colorPalette.length];
}

const TimetablePage = () => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState('all');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    scheduleService.getStudentSchedule()
      .then(data => {
        setScheduleItems(data);
        setError('');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [location]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await scheduleService.deleteScheduleItem(id);
      setScheduleItems(items => items.filter(item => item._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter items by selected day
  const filteredItems = selectedDay === 'all' 
    ? scheduleItems 
    : scheduleItems.filter(item => item.dayOfWeek === selectedDay);

  // Map for quick lookup: { day: { slot: [items] } }
  const gridMap = {};
  daysOfWeek.forEach(day => {
    gridMap[day] = {};
    timeSlots.forEach(slot => {
      gridMap[day][slot] = [];
    });
  });
  scheduleItems.forEach((item, idx) => {
    // Place item in all slots it covers
    let placed = false;
    timeSlots.forEach(slot => {
      if (isInSlot(item.startTime, item.endTime, slot)) {
        gridMap[item.dayOfWeek][slot].push({ ...item, color: getColor(idx) });
        placed = true;
      }
    });
    // If not placed (e.g., time outside grid), skip
  });

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
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-5xl font-bold text-white mb-2">
            My Timetable
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Manage your class schedule and academic activities
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-800">{scheduleItems.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-2xl">
                📚
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days with Classes</p>
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(scheduleItems.map(item => item.dayOfWeek)).size}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-2xl">
                📅
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-800">
                  {scheduleItems.filter(item => 
                    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(item.dayOfWeek)
                  ).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-2xl">
                🎯
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekend Classes</p>
                <p className="text-2xl font-bold text-gray-800">
                  {scheduleItems.filter(item => 
                    ['Saturday', 'Sunday'].includes(item.dayOfWeek)
                  ).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-2xl">
                🌟
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls Section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <label className="text-white font-medium">Filter by Day:</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all">All Days</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/timetable/add')}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            + Add New Class
          </motion.button>
        </motion.div>

        {/* Timetable Grid */}
        {loading ? (
          <motion.div 
            className="text-center py-16"
            variants={itemVariants}
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading your timetable...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-center py-16"
            variants={itemVariants}
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium">Error loading timetable</p>
              <p className="text-red-500 text-sm mt-2">{error}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="glass-card p-6"
            variants={itemVariants}
          >
            <div className="overflow-x-auto">
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `120px repeat(${daysOfWeek.length}, minmax(180px, 1fr))`,
                  minWidth: 1000,
                }}
              >
                {/* Header Row */}
                <div className="bg-white/20 backdrop-blur-sm font-bold flex items-center justify-center border border-white/30 h-16 text-gray-800 rounded-t-lg">
                  Time
                </div>
                {daysOfWeek.map(day => (
                  <div
                    key={day}
                    className="bg-white/20 backdrop-blur-sm font-bold flex items-center justify-center border border-white/30 h-16 text-gray-800 rounded-t-lg"
                  >
                    {day}
                  </div>
                ))}
                
                {/* Time slots and grid cells */}
                {timeSlots.map((slot, slotIndex) => (
                  <React.Fragment key={slot}>
                    {/* Time label */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center h-28 font-semibold text-gray-800">
                      {slot}
                    </div>
                    {daysOfWeek.map((day, dIdx) => (
                      <div
                        key={day + slot}
                        className="relative border border-white/20 h-28 overflow-y-auto bg-white/5 backdrop-blur-sm"
                      >
                        {gridMap[day][slot].map((item, i) => (
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`mb-2 p-3 rounded-lg shadow-lg ${item.color} text-white flex flex-col h-full`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="font-bold text-sm mb-1">{item.courseCode}</div>
                                <div className="text-xs opacity-90 line-clamp-2">{item.courseName}</div>
                              </div>
                              <div className="flex space-x-1 ml-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => navigate(`/timetable/edit/${item._id}`)}
                                  className="text-white/80 hover:text-white text-xs bg-white/20 rounded px-2 py-1 transition-colors"
                                  title="Edit"
                                >
                                  ✏️
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(item._id)}
                                  className="text-white/80 hover:text-white text-xs bg-white/20 rounded px-2 py-1 transition-colors"
                                  title="Delete"
                                >
                                  🗑️
                                </motion.button>
                              </div>
                            </div>
                            <div className="text-xs opacity-75 mt-auto">
                              {item.startTime} - {item.endTime}
                            </div>
                            {item.location && (
                              <div className="text-xs opacity-75 mt-1">
                                📍 {item.location}
                              </div>
                            )}
                            {item.instructor && (
                              <div className="text-xs opacity-75 mt-1">
                                👨‍🏫 {item.instructor}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && scheduleItems.length === 0 && (
          <motion.div 
            className="text-center py-16"
            variants={itemVariants}
          >
            <div className="glass-card p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-white mb-2">No Classes Scheduled</h3>
              <p className="text-white/80 mb-6">Start building your timetable by adding your first class!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/timetable/add')}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
              >
                Add Your First Class
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TimetablePage; 