import asyncHandler from 'express-async-handler';
import ScheduleItem from '../models/ScheduleItem.js';
import User from '../models/User.js';

// Create a new schedule item
const createScheduleItem = asyncHandler(async (req, res) => {
  const { courseName, courseCode, dayOfWeek, startTime, endTime, location, instructor } = req.body;
  if (!courseName || !courseCode || !dayOfWeek || !startTime || !endTime) {
    res.status(400);
    throw new Error('Missing required fields');
  }
  const scheduleItem = await ScheduleItem.create({
    user: req.user._id,
    courseName,
    courseCode,
    dayOfWeek,
    startTime,
    endTime,
    location,
    instructor,
  });
  res.status(201).json(scheduleItem);
});

// Get all schedule items for the authenticated student
const getStudentSchedule = asyncHandler(async (req, res) => {
  const schedule = await ScheduleItem.find({ user: req.user._id })
    .sort({
      dayOfWeek: 1, // Alphabetical order (Monday, ... Sunday)
      startTime: 1,
    });
  res.json(schedule);
});

// Get a single schedule item by id (user or admin only)
const getScheduleItemById = asyncHandler(async (req, res) => {
  const item = await ScheduleItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Schedule item not found');
  }
  if (item.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized');
  }
  res.json(item);
});

// Update a schedule item (user or admin only)
const updateScheduleItem = asyncHandler(async (req, res) => {
  const item = await ScheduleItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Schedule item not found');
  }
  if (item.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized');
  }
  const { courseName, courseCode, dayOfWeek, startTime, endTime, location, instructor } = req.body;
  if (courseName !== undefined) item.courseName = courseName;
  if (courseCode !== undefined) item.courseCode = courseCode;
  if (dayOfWeek !== undefined) item.dayOfWeek = dayOfWeek;
  if (startTime !== undefined) item.startTime = startTime;
  if (endTime !== undefined) item.endTime = endTime;
  if (location !== undefined) item.location = location;
  if (instructor !== undefined) item.instructor = instructor;
  const updated = await item.save();
  res.json(updated);
});

// Delete a schedule item (user or admin only)
const deleteScheduleItem = asyncHandler(async (req, res) => {
  const item = await ScheduleItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Schedule item not found');
  }
  if (item.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized');
  }
  await item.deleteOne();
  res.json({ message: 'Schedule item deleted successfully' });
});

export {
  createScheduleItem,
  getStudentSchedule,
  getScheduleItemById,
  updateScheduleItem,
  deleteScheduleItem,
}; 