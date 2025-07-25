import React, { useState } from "react";
import lostFoundService from "../../services/lostFoundService";

const CATEGORY_OPTIONS = [
  "Electronics",
  "Clothing",
  "Stationery",
  "Books",
  "Keys",
  "Documents",
  "Jewelry",
  "Other",
];

const TYPE_OPTIONS = ["Lost", "Found"];

const ReportItemPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("location", location);
      formData.append("contactEmail", contactEmail);
      if (image) {
        formData.append("image", image);
      }
      await lostFoundService.createItem(formData);
      setSuccess("Item reported successfully!");
      setTitle("");
      setDescription("");
      setCategory("");
      setType("");
      setImage(null);
      setLocation("");
      setContactEmail("");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to report item. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Report Lost or Found Item</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Type</label>
          <div className="flex gap-4">
            {TYPE_OPTIONS.map((opt) => (
              <label key={opt} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="type"
                  value={opt}
                  checked={type === opt}
                  onChange={() => setType(opt)}
                  required
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Contact Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Reporting..." : "Report Item"}
        </button>
      </form>
    </div>
  );
};

export default ReportItemPage; 