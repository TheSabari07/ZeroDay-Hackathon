import React, { useState, useEffect } from "react";
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

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Browse Lost & Found Items</h2>
      {/* Filter & Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <select
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {/* Loading/Error */}
      {loading && <div className="text-center text-blue-600">Loading items...</div>}
      {error && <div className="text-center text-red-600 mb-4">{error}</div>}
      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {!loading && items.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No items found.</div>
        )}
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow rounded p-4 flex flex-col h-full"
          >
            <div className="h-40 w-full mb-3 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
              {item.image ? (
                <img
                  src={`${import.meta.env.VITE_BACKEND_API_URL}/${item.image.replace(/^server\//, '')}`}
                  alt={item.title}
                  className="object-cover h-full w-full"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1 truncate">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-2 truncate">
              {item.description?.length > 80
                ? item.description.slice(0, 80) + "..."
                : item.description}
            </p>
            <div className="text-xs text-gray-500 mb-1">
              <span className="mr-2">Category: {item.category}</span>
              <span className="mr-2">Type: {item.type}</span>
            </div>
            <div className="text-xs text-gray-500 mb-1">
              <span className="mr-2">Location: {item.location}</span>
            </div>
            <div className="text-xs text-gray-500 mb-1">
              <span className="mr-2">Contact: {item.contactEmail}</span>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              <span className="mr-2">Status: {item.status}</span>
              <span>
                Reported: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
              </span>
            </div>
            <Link
              to={`/lostfound/${item._id}`}
              className="mt-auto inline-block bg-blue-600 text-white text-center font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseItemsPage; 