import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import skillService from '../../services/skillService';

const MySkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingSkills, setDeletingSkills] = useState(new Set());
  const navigate = useNavigate();

  // Fetch user's skills
  const fetchSkills = async () => {
    setLoading(true);
    setError('');

    try {
      const userSkills = await skillService.getUserSkills();
      setSkills(userSkills);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch your skills');
    } finally {
      setLoading(false);
    }
  };

  // Fetch skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Handle skill deletion
  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill? This action cannot be undone.')) {
      return;
    }

    setDeletingSkills(prev => new Set(prev).add(skillId));

    try {
      await skillService.deleteSkill(skillId);
      // Remove the skill from the local state
      setSkills(prev => prev.filter(skill => skill._id !== skillId));
    } catch (err) {
      console.error('Failed to delete skill:', err);
      // You could add a toast notification here
    } finally {
      setDeletingSkills(prev => {
        const newSet = new Set(prev);
        newSet.delete(skillId);
        return newSet;
      });
    }
  };

  // Get status color for styling
  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-green-100 text-green-800 border-green-200',
      'Booked Out': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Inactive': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get category color for styling
  const getCategoryColor = (category) => {
    const colors = {
      'Coding': 'from-blue-500 to-cyan-500',
      'Design': 'from-purple-500 to-pink-500',
      'Languages': 'from-green-500 to-emerald-500',
      'Academics': 'from-orange-500 to-red-500',
      'Music': 'from-indigo-500 to-purple-500',
      'Sports': 'from-teal-500 to-green-500',
      'Other': 'from-gray-500 to-slate-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  // Get level color for styling
  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading your skills...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center py-12"
          >
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <motion.button
              onClick={fetchSkills}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">My Skills</h1>
          <p className="text-xl text-white/90">
            Manage your skill listings and track bookings
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8 justify-center"
        >
          <motion.button
            onClick={() => navigate('/skills/list')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
          >
            List New Skill
          </motion.button>
          <motion.button
            onClick={() => navigate('/skills/my-bookings')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary"
          >
            View My Bookings
          </motion.button>
        </motion.div>

        {/* Skills Grid */}
        {skills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card text-center py-12"
          >
            <p className="text-gray-600 text-lg mb-4">You haven't listed any skills yet.</p>
            <p className="text-gray-500 mb-6">Start sharing your knowledge with other students!</p>
            <motion.button
              onClick={() => navigate('/skills/list')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              List Your First Skill
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="feature-card"
              >
                {/* Header with Category and Status */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${getCategoryColor(skill.category)} text-white`}>
                    {skill.category}
                  </span>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(skill.status)}`}>
                    {skill.status}
                  </span>
                </div>

                {/* Skill Title and Level */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{skill.title}</h3>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(skill.level)} mb-3`}>
                  {skill.level}
                </span>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{skill.description}</p>

                {/* Availability */}
                {skill.availability && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Availability</p>
                    <p className="text-sm text-gray-700">{skill.availability}</p>
                  </div>
                )}

                {/* Contact Method */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</p>
                  <p className="text-sm text-gray-700">{skill.contactMethod}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link to={`/skills/${skill._id}`} className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full btn-primary text-sm"
                    >
                      View Details
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={() => handleDeleteSkill(skill._id)}
                    disabled={deletingSkills.has(skill._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-danger text-sm px-3 py-2 disabled:opacity-50"
                  >
                    {deletingSkills.has(skill._id) ? 'Deleting...' : 'Delete'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <motion.button
            onClick={fetchSkills}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary"
          >
            Refresh Skills
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default MySkillsPage; 