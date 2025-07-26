import React, { useState, useEffect } from 'react';
import pollService from '../../services/pollService';

const PollManagementPage = () => {
  const [polls, setPolls] = useState([]);
  const [editingPoll, setEditingPoll] = useState(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(null);

  // Fetch all polls on component mount
  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const data = await pollService.getAllPolls();
      setPolls(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingPoll(null);
    setQuestion('');
    setOptions(['', '']);
    setIsActive(true);
    setError('');
    setSuccess('');
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Question is required');
      return;
    }

    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      setError('At least 2 options are required');
      return;
    }

    try {
      setLoading(true);
      const pollData = {
        question: question.trim(),
        options: validOptions,
        isActive
      };

      if (editingPoll) {
        await pollService.updatePoll(editingPoll._id, pollData);
        setSuccess('Poll updated successfully');
      } else {
        await pollService.createPoll(pollData);
        setSuccess('Poll created successfully');
      }

      resetForm();
      fetchPolls();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save poll');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (poll) => {
    setEditingPoll(poll);
    setQuestion(poll.question);
    setOptions([...poll.options, '']); // Add empty option for new additions
    setIsActive(poll.isActive);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      try {
        setLoading(true);
        await pollService.deletePoll(id);
        setPolls(polls.filter(poll => poll._id !== id));
        setSuccess('Poll deleted successfully');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete poll');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewResults = (poll) => {
    setShowResults(showResults === poll._id ? null : poll._id);
  };

  const getMaxVotes = (results) => {
    return Math.max(...Object.values(results));
  };

  const calculatePercentage = (votes, total) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Poll Management</h1>
          <p className="mt-2 text-gray-600">Create and manage polls for students</p>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Create/Edit Poll Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingPoll ? 'Edit Poll' : 'Create New Poll'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question *
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Enter your poll question (minimum 10 characters)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options * (minimum 2)
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Option ${index + 1}`}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 focus:outline-none"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none"
                >
                  + Add Option
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Poll is active (students can vote)
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingPoll ? 'Update Poll' : 'Create Poll')}
              </button>
              {editingPoll && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Polls List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Polls</h2>
          </div>
          
          {loading && polls.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Loading polls...</div>
          ) : polls.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No polls found</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {polls.map((poll) => (
                <div key={poll._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {poll.question}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          poll.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {poll.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span>Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
                        <span>Total votes: {poll.totalVotes || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleViewResults(poll)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {showResults === poll._id ? 'Hide Results' : 'View Results'}
                      </button>
                      <button
                        onClick={() => handleEdit(poll)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(poll._id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Results Section */}
                  {showResults === poll._id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Poll Results</h4>
                      {poll.results && Object.keys(poll.results).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(poll.results).map(([option, votes]) => {
                            const maxVotes = getMaxVotes(poll.results);
                            const percentage = calculatePercentage(votes, poll.totalVotes);
                            const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
                            
                            return (
                              <div key={option} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium text-gray-700">{option}</span>
                                  <span className="text-gray-500">
                                    {votes} votes ({percentage}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${barWidth}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500">No votes yet</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollManagementPage; 