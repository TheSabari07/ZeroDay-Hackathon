import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import skillService from '../../services/skillService';

const BrowseSkillsPage = () => {
  // State for skills data
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for filters and search
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Category and level options
  const categories = [
    'Coding',
    'Design', 
    'Languages',
    'Academics',
    'Music',
    'Sports',
    'Other'
  ];

  const levels = [
    'Beginner',
    'Intermediate', 
    'Advanced'
  ];

  // Fetch skills with filters
  const fetchSkills = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (filterCategory) params.category = filterCategory;
      if (filterLevel) params.level = filterLevel;
      if (searchTerm) params.search = searchTerm;

      const data = await skillService.getAllSkills(params);
      setSkills(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  // Fetch skills on mount and when filters change
  useEffect(() => {
    fetchSkills();
  }, [filterCategory, filterLevel, searchTerm]);

  // Clear all filters
  const clearFilters = () => {
    setFilterCategory('');
    setFilterLevel('');
    setSearchTerm('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="glass-card p-8 mb-6">
            <h1 className="text-5xl font-bold text-gradient mb-4">Browse Skills</h1>
            <p className="text-xl text-white/90 font-medium">
              Discover and learn from your fellow students
            </p>
          </div>
        </motion.div>

        {/* Filters and Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card mb-8 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search Input */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-3">
                Search Skills
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="Search by title or description..."
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-3">
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-3">
                Level
              </label>
              <div className="relative">
                <select
                  id="level"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none bg-white"
                >
                  <option value="">All Levels</option>
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(filterCategory || filterLevel || searchTerm) && (
            <div className="mt-6 flex justify-center">
              <motion.button
                onClick={clearFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                Clear All Filters
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading skills...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center py-8"
          >
            <p className="text-red-600 text-lg">{error}</p>
            <motion.button
              onClick={fetchSkills}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary mt-4"
            >
              Try Again
            </motion.button>
          </motion.div>
        )}

        {/* Skills Grid */}
        {!loading && !error && (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-white text-lg">
                {skills.length} skill{skills.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Skills Cards */}
            {skills.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card text-center py-12"
              >
                <p className="text-gray-600 text-lg mb-4">No skills found matching your criteria</p>
                <motion.button
                  onClick={clearFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="feature-card"
                  >
                    {/* Category Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${getCategoryColor(skill.category)} text-white`}>
                        {skill.category}
                      </span>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {skill.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {skill.description}
                    </p>

                    {/* Availability */}
                    {skill.availability && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Availability</p>
                        <p className="text-sm text-gray-700">{skill.availability}</p>
                      </div>
                    )}

                    {/* Tutor Info */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tutor</p>
                      <p className="text-sm text-gray-700">{skill.user?.email || 'Unknown'}</p>
                    </div>

                    {/* Contact Method */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</p>
                      <p className="text-sm text-gray-700">{skill.contactMethod}</p>
                    </div>

                    {/* View Details Button */}
                    <Link to={`/skills/${skill._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full btn-primary"
                      >
                        View Details
                      </motion.button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseSkillsPage; 