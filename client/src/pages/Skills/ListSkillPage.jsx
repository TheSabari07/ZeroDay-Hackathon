import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import skillService from '../../services/skillService';

const ListSkillPage = () => {
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [availability, setAvailability] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  
  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Category options with icons
  const categories = [
    { value: 'Coding', label: 'Coding', icon: '💻', color: 'from-blue-500 to-cyan-500' },
    { value: 'Design', label: 'Design', icon: '🎨', color: 'from-purple-500 to-pink-500' },
    { value: 'Languages', label: 'Languages', icon: '🌍', color: 'from-green-500 to-emerald-500' },
    { value: 'Academics', label: 'Academics', icon: '📚', color: 'from-orange-500 to-red-500' },
    { value: 'Music', label: 'Music', icon: '🎵', color: 'from-indigo-500 to-purple-500' },
    { value: 'Sports', label: 'Sports', icon: '⚽', color: 'from-teal-500 to-green-500' },
    { value: 'Other', label: 'Other', icon: '✨', color: 'from-gray-500 to-slate-500' }
  ];

  // Level options with descriptions
  const levels = [
    { value: 'Beginner', label: 'Beginner', description: 'Basic knowledge, can teach fundamentals' },
    { value: 'Intermediate', label: 'Intermediate', description: 'Good understanding, can teach practical skills' },
    { value: 'Advanced', label: 'Advanced', description: 'Expert level, can teach complex concepts' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate required fields
      if (!title.trim() || !description.trim() || !category || !contactMethod.trim()) {
        throw new Error('Please fill in all required fields');
      }

      // Validate description length
      if (description.trim().length < 20) {
        throw new Error('Description must be at least 20 characters long');
      }

      const skillData = {
        title: title.trim(),
        description: description.trim(),
        category,
        level,
        availability: availability.trim(),
        contactMethod: contactMethod.trim(),
      };

      await skillService.createSkill(skillData);
      
      setSuccess('Skill listed successfully! Redirecting to your skills...');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/skills/my-listings');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create skill listing');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.color : 'from-gray-500 to-slate-500';
  };

  const getLevelColor = (levelValue) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800 border-green-200',
      'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Advanced': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[levelValue] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💡</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">Share Your Knowledge</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Help other students learn by listing your skills and expertise. 
            Connect, teach, and grow together!
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Section */}
            <div className="space-y-3">
              <label htmlFor="title" className="block text-lg font-semibold text-gray-800">
                What skill can you teach? *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., Python Programming, Graphic Design Basics, Spanish Conversation"
                required
              />
              <p className="text-sm text-gray-600">Be specific and descriptive about what you can teach</p>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <label htmlFor="description" className="block text-lg font-semibold text-gray-800">
                Tell us more about your expertise *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                placeholder="Describe your experience, what you can teach, and what students will learn. Be detailed and engaging!"
                required
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Share your experience and what students will gain</p>
                <span className={`text-sm font-medium ${description.length >= 20 ? 'text-green-600' : 'text-gray-500'}`}>
                  {description.length}/20 characters
                </span>
              </div>
            </div>

            {/* Category and Level Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Choose a category *
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {categories.map((cat) => (
                    <motion.div
                      key={cat.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        id={cat.value}
                        name="category"
                        value={cat.value}
                        checked={category === cat.value}
                        onChange={(e) => setCategory(e.target.value)}
                        className="hidden"
                        required
                      />
                      <label
                        htmlFor={cat.value}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          category === cat.value
                            ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                            : 'border-gray-200 bg-white/50 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${cat.color} flex items-center justify-center text-xl`}>
                            {cat.icon}
                          </div>
                          <span className="font-medium text-gray-800">{cat.label}</span>
                        </div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Level Selection */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Your skill level
                </label>
                <div className="space-y-3">
                  {levels.map((lvl) => (
                    <motion.div
                      key={lvl.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        id={lvl.value}
                        name="level"
                        value={lvl.value}
                        checked={level === lvl.value}
                        onChange={(e) => setLevel(e.target.value)}
                        className="hidden"
                      />
                      <label
                        htmlFor={lvl.value}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          level === lvl.value
                            ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                            : 'border-gray-200 bg-white/50 hover:border-gray-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{lvl.label}</span>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getLevelColor(lvl.value)}`}>
                              {lvl.value}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{lvl.description}</p>
                        </div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability Section */}
            <div className="space-y-3">
              <label htmlFor="availability" className="block text-lg font-semibold text-gray-800">
                When are you available?
              </label>
              <input
                type="text"
                id="availability"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., Weekends, Evenings Mon-Wed, Flexible schedule, After 6 PM"
              />
              <p className="text-sm text-gray-600">Let students know when you're free to teach</p>
            </div>

            {/* Contact Method Section */}
            <div className="space-y-3">
              <label htmlFor="contactMethod" className="block text-lg font-semibold text-gray-800">
                How can students contact you? *
              </label>
              <input
                type="text"
                id="contactMethod"
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="e.g., Email: john@email.com, WhatsApp: +1234567890, Campus Chat"
                required
              />
              <p className="text-sm text-gray-600">Provide a reliable way for students to reach you</p>
            </div>

            {/* Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center space-x-3"
              >
                <span className="text-xl">⚠️</span>
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center space-x-3"
              >
                <span className="text-xl">✅</span>
                <span className="font-medium">{success}</span>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Creating Your Skill Listing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    List My Skill
                  </div>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate('/skills/browse')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary text-lg py-4"
              >
                Browse Skills Instead
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 glass-card p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💡</span>
            Tips for a Great Skill Listing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span>Be specific about what you can teach and your experience level</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span>Include clear availability and contact information</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span>Write an engaging description that highlights your expertise</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span>Choose the right category to help students find your skill</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ListSkillPage; 