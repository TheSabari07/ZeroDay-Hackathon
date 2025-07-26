import React, { useState, useEffect } from 'react';
import feedItemService from '../../services/feedItemService';

const feedTypes = [
  'All',
  'News',
  'Internship',
  'Hackathon',
  'Workshop',
  'Scholarship',
  'Other',
];

const sortOptions = [
  { value: 'newest_date', label: 'Newest Relevant Date' },
  { value: 'oldest_date', label: 'Oldest Relevant Date' },
  { value: 'newest_posted', label: 'Newest Posted' },
  { value: 'oldest_posted', label: 'Oldest Posted' },
];

const FeedPage = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('newest_posted');

  useEffect(() => {
    fetchFeedItems();
    // eslint-disable-next-line
  }, [filterType, sortBy]);

  const fetchFeedItems = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterType && filterType !== 'All') {
        params.type = filterType;
      }
      if (sortBy) {
        params.sortBy = sortBy;
      }
      const data = await feedItemService.getAllFeedItems(params);
      setFeedItems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feed items');
    }
    setLoading(false);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'News': return 'bg-blue-100 text-blue-800';
      case 'Internship': return 'bg-green-100 text-green-800';
      case 'Hackathon': return 'bg-purple-100 text-purple-800';
      case 'Workshop': return 'bg-yellow-100 text-yellow-800';
      case 'Scholarship': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const truncateDescription = (description, maxLength = 150) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="glass-card p-8 mb-6">
            <h1 className="text-5xl font-bold text-gradient mb-4">Tech News & Opportunities</h1>
            <p className="text-xl text-white/90 font-medium">
              Stay updated with the latest tech news, internships, and opportunities
            </p>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <label className="font-medium text-gray-700 mr-2" htmlFor="filterType">Type:</label>
              <select
                id="filterType"
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                {feedTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
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
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Feed Items List */}
        {loading ? (
          <div className="glass-card text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading feed items...</p>
          </div>
        ) : error ? (
          <div className="glass-card text-center text-red-500 py-8">
            <p className="font-medium">Error loading feed items</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="glass-card text-center text-gray-500 py-8">
            <p className="font-medium">No feed items found</p>
            <p className="text-sm">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedItems.map(item => (
              <div key={item._id} className="glass-card overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <div className="text-xs text-gray-500 text-right">
                      <div>Posted: {new Date(item.createdAt).toLocaleDateString()}</div>
                      {item.relevantDate && (
                        <div>Due: {new Date(item.relevantDate).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {truncateDescription(item.description)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      By: {item.postedBy?.email || 'Admin'}
                    </div>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Read More
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage; 