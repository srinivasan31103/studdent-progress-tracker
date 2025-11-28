// frontend/src/pages/Attendance.jsx
import { useState, useEffect } from 'react';
import { attendanceAPI, studentsAPI } from '../utils/api';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subject, setSubject] = useState('General');

  const classes = ['9th Grade', '10th Grade', '11th Grade', '12th Grade'];
  const subjects = ['General', 'Mathematics', 'Science', 'English', 'History', 'Geography'];
  const statuses = [
    { value: 'present', label: 'Present', icon: FaCheckCircle, color: 'text-green-600' },
    { value: 'absent', label: 'Absent', icon: FaTimesCircle, color: 'text-red-600' },
    { value: 'late', label: 'Late', icon: FaClock, color: 'text-yellow-600' },
    { value: 'excused', label: 'Excused', icon: FaExclamationCircle, color: 'text-blue-600' }
  ];

  useEffect(() => {
    fetchStudents();
  }, [selectedClass]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = selectedClass ? { class: selectedClass } : {};
      const response = await studentsAPI.getAll(params);
      const studentsList = response.data.students || [];
      setStudents(studentsList);

      // Initialize attendance state for all students
      const initialAttendance = {};
      studentsList.forEach(student => {
        initialAttendance[student._id] = 'present';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status) => {
    const newAttendance = {};
    students.forEach(student => {
      newAttendance[student._id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSubmitAttendance = async () => {
    try {
      const attendanceData = students.map(student => ({
        student: student._id,
        date: selectedDate,
        status: attendance[student._id] || 'present',
        subject
      }));

      await attendanceAPI.bulkMark({ attendanceData });
      alert('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const getStatusBadge = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    if (!statusObj) return null;

    const Icon = statusObj.icon;
    return (
      <div className={`flex items-center gap-2 ${statusObj.color}`}>
        <Icon />
        <span>{statusObj.label}</span>
      </div>
    );
  };

  const getStats = () => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0
    };

    Object.values(attendance).forEach(status => {
      if (stats.hasOwnProperty(status)) {
        stats[status]++;
      }
    });

    return stats;
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Mark daily attendance for students</p>
        </div>
        <button
          onClick={handleSubmitAttendance}
          className="btn btn-primary flex items-center gap-2"
          disabled={students.length === 0}
        >
          <FaCalendarAlt />
          Save Attendance
        </button>
      </div>

      {/* Filters and Controls */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input"
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input"
            >
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleMarkAll('present')}
              className="btn bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll('absent')}
              className="btn bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1"
            >
              Mark All Absent
            </button>
            <button
              onClick={() => handleMarkAll('late')}
              className="btn bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-3 py-1"
            >
              Mark All Late
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-3xl text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            </div>
          </div>
        </div>
        <div className="card bg-red-50 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <FaTimesCircle className="text-3xl text-red-600" />
            <div>
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
          </div>
        </div>
        <div className="card bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <FaClock className="text-3xl text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
            </div>
          </div>
        </div>
        <div className="card bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <FaExclamationCircle className="text-3xl text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Excused</p>
              <p className="text-2xl font-bold text-blue-600">{stats.excused}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          Student Attendance - {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No students found</p>
            <p className="text-sm text-gray-400 mt-2">Try selecting a different class</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-lg">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">
                      {student.rollNumber} • {student.class} - {student.section}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {statuses.map((statusOption) => {
                    const Icon = statusOption.icon;
                    const isSelected = attendance[student._id] === statusOption.value;

                    return (
                      <button
                        key={statusOption.value}
                        onClick={() => handleStatusChange(student._id, statusOption.value)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? `${statusOption.color} border-current bg-opacity-10`
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                        title={statusOption.label}
                      >
                        <Icon className="text-xl" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {students.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmitAttendance}
            className="btn btn-primary px-8 py-3 text-lg"
          >
            Save Attendance for {students.length} Student{students.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
};

export default Attendance;
