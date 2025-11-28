// frontend/src/pages/StudentProfile.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { studentsAPI, marksAPI, attendanceAPI, aiAPI } from '../utils/api';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FaUser, FaEnvelope, FaPhone, FaSpinner } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState({ attendance: [], statistics: {} });
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [studentRes, marksRes, attendanceRes] = await Promise.all([
        studentsAPI.getById(id),
        marksAPI.getStudentMarks(id),
        attendanceAPI.getStudentAttendance(id, {})
      ]);

      setStudent(studentRes.data.student);
      setMarks(marksRes.data.marks || []);
      setAttendance(attendanceRes.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAISuggestion = async () => {
    if (marks.length === 0) {
      setAiSuggestion('No marks available for AI analysis.');
      return;
    }

    setLoadingAI(true);
    try {
      const latestMark = marks[0];
      const response = await aiAPI.getStudyPlan({
        studentName: student.name,
        subject: latestMark.subject,
        marks: latestMark.marks,
        maxMarks: latestMark.maxMarks
      });
      setAiSuggestion(response.data.studyPlan);
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      setAiSuggestion('Failed to get AI suggestion. Please try again.');
    } finally {
      setLoadingAI(false);
    }
  };

  // Prepare marks chart data
  const marksChartData = {
    labels: marks.slice(0, 10).reverse().map((m) => `${m.subject} (${m.examName})`),
    datasets: [
      {
        label: 'Marks Percentage',
        data: marks.slice(0, 10).reverse().map((m) => m.percentage),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3
      }
    ]
  };

  // Prepare attendance chart data
  const attendanceChartData = {
    labels: ['Present', 'Absent', 'Late', 'Excused'],
    datasets: [
      {
        label: 'Attendance Count',
        data: [
          attendance.statistics.present || 0,
          attendance.statistics.absent || 0,
          attendance.statistics.late || 0,
          attendance.statistics.excused || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ]
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Info */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{student.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{student.email}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Roll Number</p>
            <p className="font-medium">{student.rollNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Class</p>
            <p className="font-medium">{student.class} - Section {student.section}</p>
          </div>
          {student.parentName && (
            <>
              <div>
                <p className="text-sm text-gray-500">Parent Name</p>
                <p className="font-medium">{student.parentName}</p>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Parent Contact</p>
                  <p className="font-medium">{student.parentPhone || 'N/A'}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marks Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Marks Trend</h3>
          {marks.length > 0 ? (
            <Line data={marksChartData} options={{ responsive: true, maintainAspectRatio: true }} />
          ) : (
            <p className="text-gray-500 text-center py-8">No marks data available</p>
          )}
        </div>

        {/* Attendance Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
          {attendance.statistics.total > 0 ? (
            <>
              <Bar data={attendanceChartData} options={{ responsive: true, maintainAspectRatio: true }} />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Attendance Rate: <span className="font-bold text-primary-600">{attendance.statistics.attendancePercentage}%</span>
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No attendance data available</p>
          )}
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">AI Study Suggestions</h3>
          <button
            onClick={getAISuggestion}
            disabled={loadingAI || marks.length === 0}
            className="btn btn-primary flex items-center gap-2"
          >
            {loadingAI ? (
              <>
                <FaSpinner className="animate-spin" />
                Generating...
              </>
            ) : (
              'Get AI Suggestion'
            )}
          </button>
        </div>
        {aiSuggestion ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{aiSuggestion}</pre>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Click the button to get personalized AI study suggestions</p>
        )}
      </div>

      {/* Recent Marks */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Marks</h3>
        {marks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {marks.slice(0, 5).map((mark) => (
                  <tr key={mark._id}>
                    <td className="px-4 py-3 text-sm">{mark.subject}</td>
                    <td className="px-4 py-3 text-sm">{mark.examName}</td>
                    <td className="px-4 py-3 text-sm">
                      {mark.marks}/{mark.maxMarks} ({mark.percentage}%)
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        mark.grade === 'A+' || mark.grade === 'A' ? 'bg-green-100 text-green-800' :
                        mark.grade === 'B+' || mark.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        mark.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {mark.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(mark.examDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No marks recorded yet</p>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
