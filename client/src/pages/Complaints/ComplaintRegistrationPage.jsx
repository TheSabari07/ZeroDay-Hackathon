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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Complaint Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Room Number</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
              minLength={1}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
              rows={4}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
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