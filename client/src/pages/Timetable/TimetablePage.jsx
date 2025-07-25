import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

// Helper to check if a time is within a slot
function isInSlot(start, end, slot) {
  return start <= slot && end > slot;
}

// Generate a color for each class
const colorPalette = [
  'bg-blue-200',
  'bg-green-200',
  'bg-yellow-200',
  'bg-pink-200',
  'bg-purple-200',
  'bg-orange-200',
  'bg-teal-200',
  'bg-red-200',
];

function getColor(index) {
  return colorPalette[index % colorPalette.length];
}

const TimetablePage = () => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    scheduleService.getStudentSchedule()
      .then(data => {
        setScheduleItems(data);
        setError('');
      })
      .catch(() => setError('Failed to load timetable.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await scheduleService.deleteScheduleItem(id);
      setScheduleItems(items => items.filter(item => item._id !== id));
    } catch {
      setError('Failed to delete class.');
    }
  };

  // Map for quick lookup: { day: { slot: [items] } }
  const gridMap = {};
  daysOfWeek.forEach(day => {
    gridMap[day] = {};
    timeSlots.forEach(slot => {
      gridMap[day][slot] = [];
    });
  });
  scheduleItems.forEach((item, idx) => {
    // Place item in all slots it covers
    let placed = false;
    timeSlots.forEach(slot => {
      if (isInSlot(item.startTime, item.endTime, slot)) {
        gridMap[item.dayOfWeek][slot].push({ ...item, color: getColor(idx) });
        placed = true;
      }
    });
    // If not placed (e.g., time outside grid), skip
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Timetable</h1>
          <button
            onClick={() => navigate('/timetable/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            + Add New Class
          </button>
        </div>
        {loading ? (
          <div className="text-center py-10 text-lg">Loading timetable...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `100px repeat(${daysOfWeek.length}, minmax(150px, 1fr))`,
                minWidth: 900,
              }}
            >
              {/* Header Row */}
              <div className="bg-gray-200 font-bold flex items-center justify-center border border-gray-300 h-14">Time</div>
              {daysOfWeek.map(day => (
                <div
                  key={day}
                  className="bg-gray-200 font-bold flex items-center justify-center border border-gray-300 h-14"
                >
                  {day}
                </div>
              ))}
              {/* Time slots and grid cells */}
              {timeSlots.map(slot => (
                <React.Fragment key={slot}>
                  {/* Time label */}
                  <div className="bg-gray-100 border border-gray-300 flex items-center justify-center h-24 font-semibold">
                    {slot}
                  </div>
                  {daysOfWeek.map((day, dIdx) => (
                    <div
                      key={day + slot}
                      className="relative border border-gray-300 h-24 overflow-y-auto"
                    >
                      {gridMap[day][slot].map((item, i) => (
                        <div
                          key={item._id}
                          className={`mb-2 p-2 rounded shadow ${item.color} flex flex-col`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-bold">{item.courseCode}</span> - {item.courseName}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/timetable/edit/${item._id}`)}
                                className="text-blue-700 hover:underline text-sm"
                                title="Edit"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="text-red-600 hover:underline text-sm"
                                title="Delete"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="text-xs mt-1">
                            {item.startTime} - {item.endTime}
                          </div>
                          {item.location && (
                            <div className="text-xs text-gray-700 mt-1">
                              {item.location}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetablePage; 