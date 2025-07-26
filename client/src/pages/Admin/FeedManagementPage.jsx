import React, { useState, useEffect } from 'react';
import feedItemService from '../../services/feedItemService';

const feedTypes = [
  'News',
  'Internship',
  'Hackathon',
  'Workshop',
  'Scholarship',
  'Other',
];

const FeedManagementPage = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState(feedTypes[0]);
  const [relevantDate, setRelevantDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch feed items on mount
  useEffect(() => {
    fetchFeedItems();
    // eslint-disable-next-line
  }, []);

  const fetchFeedItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await feedItemService.getAllFeedItems();
      setFeedItems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch feed items');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setLink('');
    setType(feedTypes[0]);
    setRelevantDate('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate description length
    if (description.length < 20) {
      setError('Description must be at least 20 characters long');
      return;
    }

    try {
      const feedData = {
        title,
        description,
        link,
        type,
        ...(relevantDate && { relevantDate }),
      };

      if (editingItem) {
        await feedItemService.updateFeedItem(editingItem._id, feedData);
        setSuccess('Feed item updated successfully');
      } else {
        await feedItemService.createFeedItem(feedData);
        setSuccess('Feed item created successfully');
      }
      resetForm();
      fetchFeedItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save feed item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setLink(item.link);
    setType(item.type);
    setRelevantDate(item.relevantDate ? new Date(item.relevantDate).toISOString().split('T')[0] : '');
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feed item?')) return;
    setError('');
    setSuccess('');
    try {
      await feedItemService.deleteFeedItem(id);
      setFeedItems((prev) => prev.filter((item) => item._id !== id));
      setSuccess('Feed item deleted successfully');
      if (editingItem && editingItem._id === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete feed item');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 glass-card animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-slide-in">
        {editingItem ? 'Edit Feed Item' : 'Create New Feed Item'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              {feedTypes.map((feedType) => (
                <option key={feedType} value={feedType}>{feedType}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minLength={20}
            required
            rows={4}
            placeholder="Enter a detailed description (minimum 20 characters)..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relevant Date (Optional)</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
              value={relevantDate}
              onChange={(e) => setRelevantDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white py-2 px-4 rounded-md font-semibold hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-200 ease-in-out"
            disabled={loading}
          >
            {editingItem ? 'Update' : 'Create'}
          </button>
          {editingItem && (
            <button
              type="button"
              className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-semibold hover:bg-gray-400 transition duration-200 ease-in-out"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
        
        {error && <div className="text-red-500 text-center text-sm mt-2 bg-red-50 p-2 rounded">{error}</div>}
        {success && <div className="text-green-600 text-center text-sm mt-2 bg-green-50 p-2 rounded">{success}</div>}
      </form>
      
      <h3 className="text-xl font-bold mb-4 text-textDark">All Feed Items</h3>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : feedItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No feed items found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/70 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Link</th>
                <th className="px-4 py-2 text-left">Relevant Date</th>
                <th className="px-4 py-2 text-left">Posted By</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedItems.map((item) => (
                <tr key={item._id} className="border-b last:border-b-0">
                  <td className="px-4 py-2 font-semibold max-w-xs truncate">{item.title}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'News' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'Internship' ? 'bg-green-100 text-green-800' :
                      item.type === 'Hackathon' ? 'bg-purple-100 text-purple-800' :
                      item.type === 'Workshop' ? 'bg-yellow-100 text-yellow-800' :
                      item.type === 'Scholarship' ? 'bg-pink-100 text-pink-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 max-w-xs truncate">
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {item.link}
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    {item.relevantDate ? new Date(item.relevantDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-2">{item.postedBy?.email || 'N/A'}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="bg-yellow-400 text-white px-3 py-1 rounded-md font-semibold hover:bg-yellow-500 transition duration-150"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md font-semibold hover:bg-red-600 transition duration-150"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeedManagementPage; 