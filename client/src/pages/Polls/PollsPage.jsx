import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import pollService from '../../services/pollService';
import voteService from '../../services/voteService';

const PollsPage = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [votingPoll, setVotingPoll] = useState(null);

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

  const handleVote = async (pollId) => {
    const selectedOption = selectedOptions[pollId];
    
    if (!selectedOption) {
      setError('Please select an option to vote');
      return;
    }

    try {
      setVotingPoll(pollId);
      await voteService.submitVote(pollId, selectedOption);
      setSuccess('Vote submitted successfully!');
      setSelectedOptions(prev => ({ ...prev, [pollId]: '' }));
      fetchPolls(); // Refresh polls to get updated results
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit vote');
    } finally {
      setVotingPoll(null);
    }
  };

  const getMaxVotes = (results) => {
    return Math.max(...Object.values(results));
  };

  const calculatePercentage = (votes, total) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  const activePolls = polls.filter(poll => poll.isActive);
  const inactivePolls = polls.filter(poll => !poll.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="glass-card p-8 mb-6">
            <h1 className="text-5xl font-bold text-gradient mb-4">Campus Polls</h1>
            <p className="text-xl text-white/90 font-medium">
              Vote on current polls and view results
            </p>
          </div>
        </motion.div>

        {/* Error and Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
          >
            {success}
          </motion.div>
        )}

        {loading && polls.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading polls...</p>
          </div>
        ) : (
          <>
            {/* Active Polls */}
            {activePolls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                  Active Polls
                </h2>
                <div className="space-y-6">
                  {activePolls.map((poll, index) => (
                    <motion.div
                      key={poll._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="feature-card"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {poll.question}
                        </h3>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Active
                        </span>
                      </div>
                      
                      {!poll.hasVoted ? (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600 mb-4">Select your answer:</p>
                          <div className="space-y-3">
                            {poll.options.map((option) => (
                              <label key={option} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-colors">
                                <input
                                  type="radio"
                                  name={`poll-${poll._id}`}
                                  value={option}
                                  checked={selectedOptions[poll._id] === option}
                                  onChange={(e) => setSelectedOptions(prev => ({
                                    ...prev,
                                    [poll._id]: e.target.value
                                  }))}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="text-gray-700 font-medium">{option}</span>
                              </label>
                            ))}
                          </div>
                          <motion.button
                            onClick={() => handleVote(poll._id)}
                            disabled={votingPoll === poll._id || !selectedOptions[poll._id]}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            {votingPoll === poll._id ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Submitting...
                              </div>
                            ) : (
                              "Submit Vote"
                            )}
                          </motion.button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-green-700 font-medium">You have voted</span>
                          </div>
                          
                          {/* Results */}
                          {poll.results && Object.keys(poll.results).length > 0 && (
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-gray-800">Results:</h4>
                              {Object.entries(poll.results).map(([option, votes]) => {
                                const maxVotes = getMaxVotes(poll.results);
                                const percentage = calculatePercentage(votes, poll.totalVotes);
                                const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
                                const isUserVote = poll.userVote === option;
                                
                                return (
                                  <div key={option} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className={`font-medium ${isUserVote ? 'text-indigo-600' : 'text-gray-700'}`}>
                                        {option} {isUserVote && '(Your vote)'}
                                      </span>
                                      <span className="text-gray-500">
                                        {votes} votes ({percentage}%)
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                      <div
                                        className={`h-3 rounded-full transition-all duration-500 ${
                                          isUserVote ? 'bg-indigo-600' : 'bg-gray-400'
                                        }`}
                                        style={{ width: `${barWidth}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })}
                              <p className="text-sm text-gray-500 mt-3">
                                Total votes: {poll.totalVotes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Inactive Polls */}
            {inactivePolls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
                  Closed Polls
                </h2>
                <div className="space-y-6">
                  {inactivePolls.map((poll, index) => (
                    <motion.div
                      key={poll._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="feature-card border-l-4 border-red-500"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {poll.question}
                        </h3>
                        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          Closed
                        </span>
                      </div>
                      
                      {/* Results */}
                      {poll.results && Object.keys(poll.results).length > 0 ? (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-800">Final Results:</h4>
                          {Object.entries(poll.results).map(([option, votes]) => {
                            const maxVotes = getMaxVotes(poll.results);
                            const percentage = calculatePercentage(votes, poll.totalVotes);
                            const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
                            const isUserVote = poll.userVote === option;
                            
                            return (
                              <div key={option} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className={`font-medium ${isUserVote ? 'text-indigo-600' : 'text-gray-700'}`}>
                                    {option} {isUserVote && '(Your vote)'}
                                  </span>
                                  <span className="text-gray-500">
                                    {votes} votes ({percentage}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className={`h-3 rounded-full transition-all duration-500 ${
                                      isUserVote ? 'bg-indigo-600' : 'bg-gray-400'
                                    }`}
                                    style={{ width: `${barWidth}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                          <p className="text-sm text-gray-500 mt-3">
                            Total votes: {poll.totalVotes}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No votes were cast for this poll.</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {polls.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card text-center py-12"
              >
                <p className="text-gray-600 text-lg">No polls available at the moment.</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PollsPage; 