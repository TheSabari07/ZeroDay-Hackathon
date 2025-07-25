import React, { useState, useEffect } from 'react';
import announcementService from '../../services/announcementService';

const categories = [
  'General',
  'Academics',
  'Events',
  'Holidays',
  'Exams',
  'Other',
];

const AnnouncementManagementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch announcements on mount
  useEffect(() => {
    fetchAnnouncements();
    // eslint-disable-next-line
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch announcements');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEditingAnnouncement(null);
    setTitle('');
    setContent('');
    setCategory(categories[0]);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingAnnouncement) {
        await announcementService.updateAnnouncement(editingAnnouncement._id, {
          title,
          content,
          category,
        });
        setSuccess('Announcement updated successfully');
      } else {
        await announcementService.createAnnouncement({
          title,
          content,
          category,
        });
        setSuccess('Announcement created successfully');
      }
      resetForm();
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save announcement');
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setTitle(announcement.title);
    setContent(announcement.content);
    setCategory(announcement.category);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    setError('');
    setSuccess('');
    try {
      await announcementService.deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      setSuccess('Announcement deleted successfully');
      if (editingAnnouncement && editingAnnouncement._id === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 glass-card animate-fade-in">
      <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-slide-in">
        {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minLength={10}
            required
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white py-2 px-4 rounded-md font-semibold hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-200 ease-in-out"
            disabled={loading}
          >
            {editingAnnouncement ? 'Update' : 'Create'}
          </button>
          {editingAnnouncement && (
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
        {error && <div className="text-red-500 text-center text-sm mt-2">{error}</div>}
        {success && <div className="text-green-600 text-center text-sm mt-2">{success}</div>}
      </form>
      <h3 className="text-xl font-bold mb-4 text-textDark">All Announcements</h3>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No announcements found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/70 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((a) => (
                <tr key={a._id} className="border-b last:border-b-0">
                  <td className="px-4 py-2 font-semibold">{a.title}</td>
                  <td className="px-4 py-2">{a.category}</td>
                  <td className="px-4 py-2">{a.author?.email || 'N/A'}</td>
                  <td className="px-4 py-2">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="bg-yellow-400 text-white px-3 py-1 rounded-md font-semibold hover:bg-yellow-500 transition duration-150"
                      onClick={() => handleEdit(a)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md font-semibold hover:bg-red-600 transition duration-150"
                      onClick={() => handleDelete(a._id)}
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

export default AnnouncementManagementPage; 