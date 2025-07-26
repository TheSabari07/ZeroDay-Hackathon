import asyncHandler from 'express-async-handler';
import Poll from '../models/Poll.js';
import Vote from '../models/Vote.js';

// Create a new poll
export const createPoll = asyncHandler(async (req, res) => {
  const { question, options } = req.body;
  
  if (!question || !options || !Array.isArray(options) || options.length < 2) {
    res.status(400);
    throw new Error('Question and at least 2 options are required');
  }

  const poll = await Poll.create({
    question,
    options,
    createdBy: req.user._id,
  });

  await poll.populate('createdBy', 'email');
  res.status(201).json(poll);
});

// Get all polls with vote results
export const getAllPolls = asyncHandler(async (req, res) => {
  const polls = await Poll.find().populate('createdBy', 'email').sort({ createdAt: -1 });
  
  const pollsWithResults = await Promise.all(
    polls.map(async (poll) => {
      // Get all votes for this poll
      const votes = await Vote.find({ poll: poll._id });
      
      // Calculate results for each option
      const results = {};
      poll.options.forEach(option => {
        results[option] = votes.filter(vote => vote.selectedOption === option).length;
      });
      
      // Check if current user has voted
      let hasVoted = false;
      if (req.user) {
        const userVote = await Vote.findOne({ poll: poll._id, user: req.user._id });
        hasVoted = !!userVote;
      }
      
      return {
        ...poll.toObject(),
        results,
        hasVoted,
        totalVotes: votes.length
      };
    })
  );
  
  res.json(pollsWithResults);
});

// Get a single poll by ID with vote results
export const getPollById = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id).populate('createdBy', 'email');
  
  if (!poll) {
    res.status(404);
    throw new Error('Poll not found');
  }
  
  // Get all votes for this poll
  const votes = await Vote.find({ poll: poll._id });
  
  // Calculate results for each option
  const results = {};
  poll.options.forEach(option => {
    results[option] = votes.filter(vote => vote.selectedOption === option).length;
  });
  
  // Check if current user has voted
  let hasVoted = false;
  let userVote = null;
  if (req.user) {
    userVote = await Vote.findOne({ poll: poll._id, user: req.user._id });
    hasVoted = !!userVote;
  }
  
  const pollWithResults = {
    ...poll.toObject(),
    results,
    hasVoted,
    userVote: userVote ? userVote.selectedOption : null,
    totalVotes: votes.length
  };
  
  res.json(pollWithResults);
});

// Update an existing poll (admin only)
export const updatePoll = asyncHandler(async (req, res) => {
  const { question, options, isActive } = req.body;
  
  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only admins can update polls');
  }
  
  const poll = await Poll.findById(req.params.id);
  
  if (!poll) {
    res.status(404);
    throw new Error('Poll not found');
  }
  
  // Update fields if provided
  if (question !== undefined) poll.question = question;
  if (options !== undefined) {
    if (!Array.isArray(options) || options.length < 2) {
      res.status(400);
      throw new Error('At least 2 options are required');
    }
    poll.options = options;
  }
  if (isActive !== undefined) poll.isActive = isActive;
  
  await poll.save();
  await poll.populate('createdBy', 'email');
  
  res.json(poll);
});

// Delete a poll (admin only)
export const deletePoll = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Only admins can delete polls');
  }
  
  const poll = await Poll.findById(req.params.id);
  
  if (!poll) {
    res.status(404);
    throw new Error('Poll not found');
  }
  
  // Delete all associated votes for this poll
  await Vote.deleteMany({ poll: poll._id });
  
  // Delete the poll
  await poll.deleteOne();
  
  res.json({ message: 'Poll and all associated votes deleted successfully' });
}); 