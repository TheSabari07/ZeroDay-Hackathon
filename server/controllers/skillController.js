import asyncHandler from 'express-async-handler';
import Skill from '../models/Skill.js';
import User from '../models/User.js';

// Create a new skill listing
const createSkill = asyncHandler(async (req, res) => {
  const { title, description, category, level, availability, contactMethod } = req.body;

  // Validate required fields
  if (!title || !description || !category || !contactMethod) {
    res.status(400);
    throw new Error('Missing required fields: title, description, category, and contactMethod are required');
  }

  // Validate description length
  if (description.length < 20) {
    res.status(400);
    throw new Error('Description must be at least 20 characters long');
  }

  // Create the skill
  const skill = await Skill.create({
    user: req.user._id,
    title,
    description,
    category,
    level: level || 'Beginner',
    availability,
    contactMethod,
  });

  // Populate user info
  await skill.populate('user', 'email name');

  res.status(201).json(skill);
});

// Get all available skills with filtering and search
const getAllSkills = asyncHandler(async (req, res) => {
  const { category, level, status, search } = req.query;

  // Build filter object
  const filter = {};

  // Only show available skills by default
  if (!status) {
    filter.status = 'Available';
  } else {
    filter.status = status;
  }

  // Add category filter
  if (category) {
    filter.category = category;
  }

  // Add level filter
  if (level) {
    filter.level = level;
  }

  // Build search query
  let searchQuery = {};
  if (search) {
    searchQuery = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    };
  }

  // Combine filters
  const finalFilter = { ...filter, ...searchQuery };

  const skills = await Skill.find(finalFilter)
    .populate('user', 'email name')
    .sort({ createdAt: -1 });

  res.json(skills);
});

// Get skills listed by the authenticated user
const getUserSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ user: req.user._id })
    .populate('user', 'email name')
    .sort({ createdAt: -1 });

  res.json(skills);
});

// Get a single skill by ID
const getSkillById = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id)
    .populate('user', 'email name');

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  res.json(skill);
});

// Update an existing skill
const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  // Check if user is authorized to update (original user or admin)
  if (skill.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this skill');
  }

  const { title, description, category, level, availability, contactMethod, status } = req.body;

  // Validate description length if provided
  if (description && description.length < 20) {
    res.status(400);
    throw new Error('Description must be at least 20 characters long');
  }

  // Update fields if provided
  if (title !== undefined) skill.title = title;
  if (description !== undefined) skill.description = description;
  if (category !== undefined) skill.category = category;
  if (level !== undefined) skill.level = level;
  if (availability !== undefined) skill.availability = availability;
  if (contactMethod !== undefined) skill.contactMethod = contactMethod;
  if (status !== undefined) skill.status = status;

  const updatedSkill = await skill.save();
  await updatedSkill.populate('user', 'email name');

  res.json(updatedSkill);
});

// Delete a skill
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  // Check if user is authorized to delete (original user or admin)
  if (skill.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this skill');
  }

  await skill.deleteOne();

  res.json({ message: 'Skill deleted successfully' });
});

export {
  createSkill,
  getAllSkills,
  getUserSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
}; 