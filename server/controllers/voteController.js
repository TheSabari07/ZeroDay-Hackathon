import asyncHandler from 'express-async-handler';
import Vote from '../models/Vote.js';
import Poll from '../models/Poll.js';

// Submit a vote on a poll
export const submitVote = asyncHandler(async (req, res) => {
  const { selectedOption } = req.body;
  const pollId = req.params.id;
  
  if (!selectedOption) {
    res.status(400);
    throw new Error('Selected option is required');
  }
  
  // Check if poll exists and is active
  const poll = await Poll.findById(pollId);
  if (!poll) {
    res.status(404);
    throw new Error('Poll not found');
  }
  
  if (!poll.isActive) {
    res.status(400);
    throw new Error('This poll is not active and cannot accept votes');
  }
  
  // Check if the selected option is valid
  if (!poll.options.includes(selectedOption)) {
    res.status(400);
    throw new Error('Invalid option selected');
  }
  
  // Check if user has already voted on this poll
  const existingVote = await Vote.findOne({ poll: pollId, user: req.user._id });
  if (existingVote) {
    res.status(400);
    throw new Error('You have already voted on this poll');
  }
  
  // Create the vote
  const vote = await Vote.create({
    poll: pollId,
    user: req.user._id,
    selectedOption,
  });
  
  await vote.populate('user', 'email');
  await vote.populate('poll', 'question');
  
  res.status(201).json(vote);
});

// Check if user has voted on a specific poll
export const checkUserVote = asyncHandler(async (req, res) => {
  const pollId = req.params.id;
  
  // Check if poll exists
  const poll = await Poll.findById(pollId);
  if (!poll) {
    res.status(404);
    throw new Error('Poll not found');
  }
  
  // Check if user has voted on this poll
  const vote = await Vote.findOne({ poll: pollId, user: req.user._id });
  
  const response = {
    hasVoted: !!vote,
    selectedOption: vote ? vote.selectedOption : null,
  };
  
  res.json(response);
}); 