import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { logout, user } = useAuth();

  const stats = [
    { title: 'Total Announcements', value: '12', icon: '📢', color: 'from-blue-500 to-blue-600' },
    { title: 'Active Complaints', value: '3', icon: '📝', color: 'from-orange-500 to-orange-600' },
    { title: 'Lost Items', value: '8', icon: '🔍', color: 'from-purple-500 to-purple-600' },
    { title: 'Classes Today', value: '4', icon: '📚', color: 'from-green-500 to-green-600' },
  ];

  const quickActions = [
    {
      title: 'Campus Announcements',
      description: 'Stay updated with latest campus news and events',
      icon: '📢',
      link: '/announcements',
      color: 'from-blue-500 to-blue-600',
      category: 'Communication'
    },
    {
      title: 'Tech News & Opportunities',
      description: 'Browse latest tech news, internships, and opportunities',
      icon: '🚀',
      link: '/feed',
      color: 'from-indigo-500 to-indigo-600',
      category: 'Opportunities'
    },
    {
      title: 'My Timetable',
      description: 'View and manage your class schedule',
      icon: '📅',
      link: '/timetable',
      color: 'from-purple-500 to-purple-600',
      category: 'Academic'
    },
    {
      title: 'Add New Class',
      description: 'Schedule a new class or meeting',
      icon: '➕',
      link: '/timetable/add',
      color: 'from-green-500 to-green-600',
      category: 'Academic'
    },
    {
      title: 'Browse Skills',
      description: 'Discover skills offered by other students',
      icon: '🎯',
      link: '/skills/browse',
      color: 'from-emerald-500 to-emerald-600',
      category: 'Skill Sharing'
    },
    {
      title: 'List My Skill',
      description: 'Share your knowledge with other students',
      icon: '💡',
      link: '/skills/list',
      color: 'from-teal-500 to-teal-600',
      category: 'Skill Sharing'
    },
    {
      title: 'My Skill Listings',
      description: 'Manage your offered skills and track bookings',
      icon: '📋',
      link: '/skills/my-listings',
      color: 'from-indigo-500 to-indigo-600',
      category: 'Skill Sharing'
    },
    {
      title: 'My Sessions',
      description: 'View and manage your skill sharing sessions',
      icon: '🤝',
      link: '/skills/my-bookings',
      color: 'from-violet-500 to-violet-600',
      category: 'Skill Sharing'
    },
    {
      title: 'Report Lost/Found Item',
      description: 'Report items you lost or found on campus',
      icon: '🔍',
      link: '/lostfound/report',
      color: 'from-orange-500 to-orange-600',
      category: 'Campus Life'
    },
    {
      title: 'Browse Lost & Found',
      description: 'Search through lost and found items',
      icon: '📦',
      link: '/lostfound/browse',
      color: 'from-cyan-500 to-cyan-600',
      category: 'Campus Life'
    },
    {
      title: 'Polls & Feedback',
      description: 'Vote on campus polls and view results',
      icon: '🗳️',
      link: '/polls',
      color: 'from-rose-500 to-rose-600',
      category: 'Feedback'
    },
  ];

  const studentActions = [
    {
      title: 'Raise a Complaint',
      description: 'Submit a new complaint or feedback',
      icon: '📝',
      link: '/complaints/register',
      color: 'from-red-500 to-red-600',
      category: 'Support'
    },
    {
      title: 'My Complaints',
      description: 'Track the status of your complaints',
      icon: '📋',
      link: '/complaints/my',
      color: 'from-indigo-500 to-indigo-600',
      category: 'Support'
    },
  ];

  const adminActions = [
    {
      title: 'Manage Announcements',
      description: 'Create and manage campus announcements',
      icon: '⚙️',
      link: '/admin/announcements',
      color: 'from-yellow-500 to-yellow-600',
      category: 'Administration'
    },
    {
      title: 'Manage Feed Items',
      description: 'Create and manage tech news and opportunities',
      icon: '📰',
      link: '/admin/feed',
      color: 'from-red-500 to-red-600',
      category: 'Administration'
    },
    {
      title: 'Manage Complaints',
      description: 'Review and respond to student complaints',
      icon: '🛠️',
      link: '/admin/complaints',
      color: 'from-pink-500 to-pink-600',
      category: 'Administration'
    },
    {
      title: 'Manage Polls',
      description: 'Create and manage campus polls',
      icon: '📊',
      link: '/admin/polls',
      color: 'from-amber-500 to-amber-600',
      category: 'Administration'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-gradient mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Here's what's happening on campus today
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="stats-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="feature-card"
              >
                <Link to={action.link} className="block">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        {action.category}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Role-specific Actions */}
        {user?.role === 'student' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Student Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="feature-card"
                >
                  <Link to={action.link} className="block">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{action.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {action.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {user?.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Administrative Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="feature-card"
                >
                  <Link to={action.link} className="block">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{action.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {action.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={logout}
            className="btn-secondary"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
