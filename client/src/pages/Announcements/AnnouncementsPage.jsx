import React, { useState, useEffect } from 'react';
import announcementService from '../../services/announcementService';

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
      setAnnouncements(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch announcements');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-slide-in">
        Announcements
      </h2>
      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-white/70 rounded-lg p-4 shadow">
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
      {/* Announcements List */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : announcements.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No announcements found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map(a => (
            <div key={a._id} className="bg-white shadow rounded-lg p-4 mb-4 flex flex-col animate-fade-in">
              <h3 className="text-xl font-bold mb-2 text-textDark">{a.title}</h3>
              <div className="mb-2 text-sm text-gray-500">{a.category} &bull; {new Date(a.date).toLocaleDateString()}</div>
              <div className="mb-4 text-gray-700 whitespace-pre-line">{a.content}</div>
              <div className="mt-auto text-xs text-gray-400">By: {a.author?.email || 'N/A'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage; 