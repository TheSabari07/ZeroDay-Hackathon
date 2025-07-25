import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import lostFoundService from "../../services/lostFoundService";

// Dummy auth context for user info (replace with real context/hook)
function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
  } catch {
    return null;
  }
}

const STATUS_OPTIONS = ["Pending", "Claimed", "Returned"];

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const user = getCurrentUser();
  const isAdmin = user?.role === "admin";
  const isReporter = user?.email && item?.reporterEmail && user.email === item.reporterEmail;

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await lostFoundService.getItemById(id);
        setItem(data);
        setStatus(data.status);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch item details."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
    // eslint-disable-next-line
  }, [id]);

  const handleStatusUpdate = async () => {
    setStatusLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      await lostFoundService.updateItemStatus(id, { status });
      setActionSuccess("Status updated successfully.");
      setItem((prev) => ({ ...prev, status }));
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to update status."
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDeleteLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      await lostFoundService.deleteItem(id);
      setActionSuccess("Item deleted successfully.");
      setTimeout(() => navigate("/lostfound"), 1200);
    } catch (err) {
      setActionError(
        err?.response?.data?.message || "Failed to delete item."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {loading ? (
        <div className="text-center text-blue-600">Loading item details...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : item ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-center">Item Details</h2>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0 w-full md:w-64 h-64 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              {item.image ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_API_URL}/${item.image.replace(/^server\//, '')}`}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <span className="font-semibold">Title:</span> {item.title}
              </div>
              <div>
                <span className="font-semibold">Description:</span> {item.description}
              </div>
              <div>
                <span className="font-semibold">Category:</span> {item.category}
              </div>
              <div>
                <span className="font-semibold">Type:</span> {item.type}
              </div>
              <div>
                <span className="font-semibold">Location:</span> {item.location}
              </div>
              <div>
                <span className="font-semibold">Contact Email:</span> {item.contactEmail}
              </div>
              <div>
                <span className="font-semibold">Status:</span> {item.status}
              </div>
              <div>
                <span className="font-semibold">Reported By:</span> {item.reporterEmail || "-"}
              </div>
              <div>
                <span className="font-semibold">Reported Date:</span> {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
              </div>
            </div>
          </div>
          {/* Admin/Reporter Actions */}
          {(isAdmin || isReporter) && (
            <div className="mb-4 p-4 bg-gray-50 rounded border">
              <div className="font-semibold mb-2">Actions</div>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="font-medium">Update Status:</label>
                  <select
                    className="border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-400"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={statusLoading}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    disabled={statusLoading}
                  >
                    {statusLoading ? "Updating..." : "Update"}
                  </button>
                </div>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  onClick={() => alert("Edit form coming soon!")}
                  disabled={statusLoading || deleteLoading}
                >
                  Edit Item
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete Item"}
                </button>
              </div>
              {actionError && <div className="text-red-600 text-sm mt-2">{actionError}</div>}
              {actionSuccess && <div className="text-green-600 text-sm mt-2">{actionSuccess}</div>}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default ItemDetailsPage; 