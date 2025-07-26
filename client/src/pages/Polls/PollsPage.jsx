import React, { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Polls</h1>
          <p className="mt-2 text-gray-600">Vote on current polls and view results</p>
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

        {loading && polls.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading polls...</p>
          </div>
        ) : (
          <>
            {/* Active Polls */}
            {activePolls.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Polls</h2>
                <div className="space-y-4">
                  {activePolls.map((poll) => (
                    <div key={poll._id} className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {poll.question}
                      </h3>
                      
                      {!poll.hasVoted ? (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600 mb-3">Select your answer:</p>
                          {poll.options.map((option) => (
                            <label key={option} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name={`poll-${poll._id}`}
                                value={option}
                                checked={selectedOptions[poll._id] === option}
                                onChange={(e) => setSelectedOptions(prev => ({
                                  ...prev,
                                  [poll._id]: e.target.value
                                }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                          <button
                            onClick={() => handleVote(poll._id)}
                            disabled={votingPoll === poll._id || !selectedOptions[poll._id]}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {votingPoll === poll._id ? 'Submitting...' : 'Submit Vote'}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600 font-medium">You have voted</span>
                          </div>
                          
                          {/* Results */}
                          {poll.results && Object.keys(poll.results).length > 0 && (
                            <div className="mt-4 space-y-3">
                              <h4 className="text-md font-medium text-gray-900">Results:</h4>
                              {Object.entries(poll.results).map(([option, votes]) => {
                                const maxVotes = getMaxVotes(poll.results);
                                const percentage = calculatePercentage(votes, poll.totalVotes);
                                const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
                                const isUserVote = poll.userVote === option;
                                
                                return (
                                  <div key={option} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span className={`font-medium ${isUserVote ? 'text-blue-600' : 'text-gray-700'}`}>
                                        {option} {isUserVote && '(Your vote)'}
                                      </span>
                                      <span className="text-gray-500">
                                        {votes} votes ({percentage}%)
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                          isUserVote ? 'bg-blue-600' : 'bg-gray-400'
                                        }`}
                                        style={{ width: `${barWidth}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })}
                              <p className="text-xs text-gray-500 mt-2">
                                Total votes: {poll.totalVotes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inactive Polls */}
            {inactivePolls.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Closed Polls</h2>
                <div className="space-y-4">
                  {inactivePolls.map((poll) => (
                    <div key={poll._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {poll.question}
                        </h3>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          Closed
                        </span>
                      </div>
                      
                      {/* Results */}
                      {poll.results && Object.keys(poll.results).length > 0 ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-medium text-gray-900">Final Results:</h4>
                          {Object.entries(poll.results).map(([option, votes]) => {
                            const maxVotes = getMaxVotes(poll.results);
                            const percentage = calculatePercentage(votes, poll.totalVotes);
                            const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
                            const isUserVote = poll.userVote === option;
                            
                            return (
                              <div key={option} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className={`font-medium ${isUserVote ? 'text-blue-600' : 'text-gray-700'}`}>
                                    {option} {isUserVote && '(Your vote)'}
                                  </span>
                                  <span className="text-gray-500">
                                    {votes} votes ({percentage}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      isUserVote ? 'bg-blue-600' : 'bg-gray-400'
                                    }`}
                                    style={{ width: `${barWidth}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                          <p className="text-xs text-gray-500 mt-2">
                            Total votes: {poll.totalVotes}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No votes were cast for this poll.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {polls.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No polls available at the moment.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PollsPage; 