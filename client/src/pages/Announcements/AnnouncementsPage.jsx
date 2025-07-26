import React, { useState, useEffect } from 'react';
import announcementService from '../../services/announcementService';
import { motion } from 'framer-motion';

const categories = [
  'All',
  'General',
  'Academics',
  'Events',
  'Holidays',
  'Exams',
  'Other',
];

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');

  // Fake announcements data for demo
  const fakeAnnouncements = [
    {
      _id: '1',
      title: 'Campus WiFi Maintenance Scheduled',
      content: 'The campus WiFi network will undergo maintenance on Saturday, March 15th from 2:00 AM to 6:00 AM. During this time, internet connectivity may be intermittent. We apologize for any inconvenience.',
      category: 'General',
      date: '2024-03-10',
      author: { email: 'admin@campus.edu' }
    },
    {
      _id: '2',
      title: 'Spring Semester Exam Schedule Released',
      content: 'The complete exam schedule for Spring Semester 2024 has been published. Please check your student portal for your individual exam timetable. All exams will be held in the main auditorium.',
      category: 'Exams',
      date: '2024-03-08',
      author: { email: 'academics@campus.edu' }
    },
    {
      _id: '3',
      title: 'Annual Tech Fest Registration Open',
      content: 'Registration for the Annual Tech Fest 2024 is now open! This year\'s theme is "Innovation for Tomorrow". Students can register for coding competitions, hackathons, and tech workshops. Early bird registration closes on March 20th.',
      category: 'Events',
      date: '2024-03-05',
      author: { email: 'events@campus.edu' }
    },
    {
      _id: '4',
      title: 'Library Extended Hours for Finals',
      content: 'The campus library will have extended hours during the final examination period. Starting from March 18th, the library will be open from 7:00 AM to 2:00 AM daily. Study rooms are available for group sessions.',
      category: 'Academics',
      date: '2024-03-03',
      author: { email: 'library@campus.edu' }
    },
    {
      _id: '5',
      title: 'Campus Cafeteria Menu Update',
      content: 'The campus cafeteria has updated its menu with new healthy options and international cuisine. New items include vegetarian bowls, Mediterranean salads, and Asian fusion dishes. Student meal plans remain unchanged.',
      category: 'General',
      date: '2024-03-01',
      author: { email: 'cafeteria@campus.edu' }
    }
  ];

  useEffect(() => {
    fetchAnnouncements();
    // eslint-disable-next-line
  }, [selectedCategory, sortBy]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (sortBy) {
        params.sortBy = sortBy;
      }
      const data = await announcementService.getAnnouncements(params);
      
      // If no announcements from API, use fake data for demo
      if (data.length === 0) {
        const fakeAnnouncements = [
          {
            _id: '1',
            title: 'Campus WiFi Maintenance Scheduled',
            content: 'The campus WiFi network will undergo maintenance on Saturday, March 15th from 2:00 AM to 6:00 AM. During this time, internet connectivity may be intermittent. We apologize for any inconvenience.',
            category: 'General',
            date: '2024-03-10',
            author: { email: 'admin@campus.edu' }
          },
          {
            _id: '2',
            title: 'Spring Semester Exam Schedule Released',
            content: 'The complete exam schedule for Spring Semester 2024 has been published. Please check your student portal for your individual exam timetable. All exams will be held in the main auditorium.',
            category: 'Exams',
            date: '2024-03-08',
            author: { email: 'academics@campus.edu' }
          },
          {
            _id: '3',
            title: 'Annual Tech Fest Registration Open',
            content: 'Registration for the Annual Tech Fest 2024 is now open! This year\'s theme is "Innovation for Tomorrow". Students can register for coding competitions, hackathons, and tech workshops. Early bird registration closes on March 20th.',
            category: 'Events',
            date: '2024-03-05',
            author: { email: 'events@campus.edu' }
          },
          {
            _id: '4',
            title: 'Library Extended Hours for Finals',
            content: 'The campus library will have extended hours during the final examination period. Starting from March 18th, the library will be open from 7:00 AM to 2:00 AM daily. Study rooms are available for group sessions.',
            category: 'Academics',
            date: '2024-03-03',
            author: { email: 'library@campus.edu' }
          },
          {
            _id: '5',
            title: 'Campus Cafeteria Menu Update',
            content: 'The campus cafeteria has updated its menu with new healthy options and international cuisine. New items include vegetarian bowls, Mediterranean salads, and Asian fusion dishes. Student meal plans remain unchanged.',
            category: 'General',
            date: '2024-03-01',
            author: { email: 'cafeteria@campus.edu' }
          }
        ];
        setAnnouncements(fakeAnnouncements);
      } else {
        setAnnouncements(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch announcements');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="glass-card p-8 mb-6">
            <h1 className="text-5xl font-bold text-gradient mb-4">Campus Announcements</h1>
            <p className="text-xl text-white/90 font-medium">
              Stay updated with the latest campus news and events
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <label className="font-medium text-gray-700 mr-2" htmlFor="category">Category:</label>
              <select
                id="category"
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <label className="font-medium text-gray-700 mr-2" htmlFor="sortBy">Sort By:</label>
              <select
                id="sortBy"
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="glass-card text-center py-8">Loading...</div>
        ) : error ? (
          <div className="glass-card text-center text-red-500 py-8">{error}</div>
        ) : announcements.length === 0 ? (
          <div className="glass-card text-center text-gray-500 py-8">No announcements found.</div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-white text-lg">
                {announcements.length} announcement{announcements.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {announcements.map((a, index) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="feature-card"
                >
                  {/* Category Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      {a.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(a.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {a.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {a.content}
                  </p>

                  {/* Author Info */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Posted By</p>
                    <p className="text-sm text-gray-700">{a.author?.email || 'Admin'}</p>
                  </div>

                  {/* Date Info */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</p>
                    <p className="text-sm text-gray-700">{new Date(a.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>

                  {/* Read More Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full btn-primary"
                    onClick={() => {
                      // You can add a modal or expand functionality here
                      alert(`Full announcement: ${a.content}`);
                    }}
                  >
                    Read More
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage; 