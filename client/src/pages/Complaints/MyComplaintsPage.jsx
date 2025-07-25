import React, { useEffect, useState } from 'react';
import complaintService from '../../services/complaintService';

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In-Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await complaintService.getUserComplaints();
      setComplaints(data);
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to fetch complaints. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await complaintService.deleteComplaint(id);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to delete complaint. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 animate-fade-in">
      <div className="glass-card w-full max-w-3xl mx-auto p-8 my-8">
        <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-slide-in">My Complaints</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 mb-4">{error}</div>
        ) : complaints.length === 0 ? (
          <div className="text-center text-gray-500">No complaints found.</div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        statusStyles[complaint.status] || 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {complaint.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(complaint.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Room:</span> {complaint.roomNumber}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Category:</span> {complaint.category}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Description:</span> {complaint.description}
                  </div>
                  {complaint.adminNotes && (
                    <div className="mb-1">
                      <span className="font-medium">Admin Notes:</span> {complaint.adminNotes}
                    </div>
                  )}
                </div>
                <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0 flex flex-col items-end">
                  {(complaint.status === 'Pending' || complaint.status === 'Rejected') && (
                    <button
                      onClick={() => handleDelete(complaint._id)}
                      className="px-3 py-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white rounded hover:scale-105 hover:shadow-lg text-sm transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaintsPage; 