import React, { useEffect, useState } from 'react';
import complaintService from '../../services/complaintService';

const statusOptions = [
  'Pending',
  'In-Progress',
  'Resolved',
  'Rejected',
];

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In-Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const ComplaintManagementPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editStates, setEditStates] = useState({}); // { [id]: { status, adminNotes, updating } }

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const params = filterStatus !== 'All' ? { status: filterStatus } : {};
      const data = await complaintService.getAllComplaints(params);
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
  }, [filterStatus]);

  const handleEditChange = (id, field, value) => {
    setEditStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdateStatus = async (id) => {
    setEditStates((prev) => ({ ...prev, [id]: { ...prev[id], updating: true } }));
    try {
      const { status, adminNotes } = editStates[id] || {};
      await complaintService.updateComplaintStatus(id, { status, adminNotes });
      await fetchComplaints();
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to update complaint. Please try again.'
      );
    } finally {
      setEditStates((prev) => ({ ...prev, [id]: { ...prev[id], updating: false } }));
    }
  };

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
      <>
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Complaint Management</h2>
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <label className="font-medium mr-2">Filter by Status:</label>
            <select
              className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : complaints.length === 0 ? (
          <div className="text-center text-gray-500">No complaints found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">User Email</th>
                  <th className="py-2 px-4 text-left">Room</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Description</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Admin Notes</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => {
                  const edit = editStates[complaint._id] || {
                    status: complaint.status,
                    adminNotes: complaint.adminNotes || '',
                  };
                  return (
                    <tr key={complaint._id} className="border-b">
                      <td className="py-2 px-4">{complaint.user?.email || '-'}</td>
                      <td className="py-2 px-4">{complaint.roomNumber}</td>
                      <td className="py-2 px-4">{complaint.category}</td>
                      <td className="py-2 px-4 max-w-xs truncate" title={complaint.description}>{complaint.description}</td>
                      <td className="py-2 px-4 text-xs text-gray-500">{new Date(complaint.createdAt).toLocaleString()}</td>
                      <td className="py-2 px-4">
                        <select
                          className={`px-2 py-1 rounded text-xs font-semibold ${statusStyles[edit.status] || 'bg-gray-200 text-gray-800'}`}
                          value={edit.status}
                          onChange={(e) => handleEditChange(complaint._id, 'status', e.target.value)}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:border-blue-400 text-xs"
                          value={edit.adminNotes}
                          onChange={(e) => handleEditChange(complaint._id, 'adminNotes', e.target.value)}
                          placeholder="Add notes..."
                        />
                      </td>
                      <td className="py-2 px-4 flex flex-col gap-2 min-w-[120px]">
                        <button
                          onClick={() => handleUpdateStatus(complaint._id)}
                          className="w-full py-1 px-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs mb-1 disabled:opacity-60"
                          disabled={editStates[complaint._id]?.updating}
                        >
                          {editStates[complaint._id]?.updating ? 'Updating...' : 'Update Status'}
                        </button>
                        <button
                          onClick={() => handleDelete(complaint._id)}
                          className="w-full py-1 px-2 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </>
    </div>
  );
};

export default ComplaintManagementPage; 