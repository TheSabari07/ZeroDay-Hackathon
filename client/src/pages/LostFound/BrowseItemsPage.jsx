import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import lostFoundService from "../../services/lostFoundService";
import { Link } from "react-router-dom";

const CATEGORY_OPTIONS = [
  "All",
  "Electronics",
  "Clothing",
  "Stationery",
  "Books",
  "Keys",
  "Documents",
  "Jewelry",
  "Other",
];

const TYPE_OPTIONS = ["All", "Lost", "Found"];
const STATUS_OPTIONS = ["All", "Pending", "Claimed", "Returned"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

const BrowseItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (filterCategory !== "All") params.category = filterCategory;
        if (filterType !== "All") params.type = filterType;
        if (filterStatus !== "All") params.status = filterStatus;
        if (sortBy) params.sortBy = sortBy;
        const data = await lostFoundService.getAllItems(params);
        setItems(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch items. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [filterCategory, filterType, filterStatus, sortBy]);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Claimed': 'bg-blue-100 text-blue-800',
      'Returned': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    return type === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Electronics': 'from-blue-500 to-blue-600',
      'Clothing': 'from-purple-500 to-purple-600',
      'Stationery': 'from-green-500 to-green-600',
      'Books': 'from-yellow-500 to-yellow-600',
      'Keys': 'from-orange-500 to-orange-600',
      'Documents': 'from-red-500 to-red-600',
      'Jewelry': 'from-pink-500 to-pink-600',
      'Other': 'from-gray-500 to-gray-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const clearFilters = () => {
    setFilterCategory("All");
    setFilterType("All");
    setFilterStatus("All");
    setSortBy("newest");
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
          <h1 className="text-4xl font-bold text-white mb-2">Lost & Found Items</h1>
          <p className="text-xl text-white/90">
            Browse through lost and found items on campus
          </p>
        </motion.div>

        {/* Filter & Sort Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card mb-8 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none bg-white"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none bg-white"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  {TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Status
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sort By
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
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
          {(filterCategory !== "All" || filterType !== "All" || filterStatus !== "All") && (
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
            <p className="text-white text-lg">Loading items...</p>
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
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary mt-4"
            >
              Try Again
            </motion.button>
          </motion.div>
        )}

        {/* Items Grid */}
        {!loading && !error && (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-white text-lg">
                {items.length} item{items.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card text-center py-12"
              >
                <p className="text-gray-600 text-lg mb-4">No items found matching your criteria</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="feature-card overflow-hidden"
                  >
                    {/* Image */}
                    <div className="h-48 w-full mb-4 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                      {item.image ? (
                        <img
                          src={`${import.meta.env.VITE_BACKEND_API_URL}/${item.image.replace(/^server\//, '')}`}
                          alt={item.title}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <div className="text-center text-gray-400">
                          <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">No Image</p>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description?.length > 80
                          ? item.description.slice(0, 80) + "..."
                          : item.description}
                      </p>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                          {item.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${getCategoryColor(item.category)} text-white`}>
                          {item.category}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-1 text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {item.location}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Link to={`/lostfound/${item._id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                        >
                          View Details
                        </motion.button>
                      </Link>
                    </div>
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

export default BrowseItemsPage; 