import React, { useState } from 'react';
import complaintService from '../../services/complaintService';

const categories = [
  'Water',
  'Electricity',
  'Cleaning',
  'Furniture',
  'Other',
];

const ComplaintRegistrationPage = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [category, setCategory] = useState('Water');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await complaintService.createComplaint({ roomNumber, category, description });
      setSuccess('Complaint submitted successfully!');
      setRoomNumber('');
      setCategory('Water');
      setDescription('');
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to submit complaint. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 animate-fade-in">
      <div className="glass-card w-full sm:max-w-md mx-auto p-8 my-8">
        <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-slide-in">Raise a Complaint</h2>
        {error && <div className="mb-4 text-red-500 text-center text-sm mt-1">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center text-sm mt-1">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white/70 backdrop-blur-sm"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
              minLength={1}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white/70 backdrop-blur-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white/70 backdrop-blur-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white font-semibold rounded-md shadow hover:scale-105 hover:shadow-2xl transition duration-200"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintRegistrationPage; 