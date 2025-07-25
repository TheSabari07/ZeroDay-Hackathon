import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import scheduleService from '../../services/scheduleService';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const ScheduleFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [instructor, setInstructor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      scheduleService.getScheduleItemById(id)
        .then(item => {
          setCourseName(item.courseName || '');
          setCourseCode(item.courseCode || '');
          setDayOfWeek(item.dayOfWeek || 'Monday');
          setStartTime(item.startTime || '');
          setEndTime(item.endTime || '');
          setLocation(item.location || '');
          setInstructor(item.instructor || '');
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const itemData = {
      courseName,
      courseCode,
      dayOfWeek,
      startTime,
      endTime,
      location,
      instructor,
    };
    try {
      if (id) {
        await scheduleService.updateScheduleItem(id, itemData);
        setSuccess('Schedule item updated successfully!');
      } else {
        await scheduleService.createScheduleItem(itemData);
        setSuccess('Schedule item created successfully!');
      }
      setTimeout(() => {
        navigate('/timetable', { replace: true });
        window.location.reload();
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {id ? 'Edit Schedule Item' : 'Add Schedule Item'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Course Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Course Code<span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              value={courseCode}
              onChange={e => setCourseCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Day of Week<span className="text-red-500">*</span></label>
            <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              value={dayOfWeek}
              onChange={e => setDayOfWeek(e.target.value)}
              required
            >
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block mb-1 font-medium">Start Time<span className="text-red-500">*</span></label>
              <input
                type="time"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-1 font-medium">End Time<span className="text-red-500">*</span></label>
              <input
                type="time"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g., Room 201, Main Building"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Instructor</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              value={instructor}
              onChange={e => setInstructor(e.target.value)}
              placeholder="e.g., Dr. Smith"
            />
          </div>
          {error && <div className="text-red-600 text-center">{error}</div>}
          {success && <div className="text-green-600 text-center">{success}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update' : 'Create')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleFormPage; 