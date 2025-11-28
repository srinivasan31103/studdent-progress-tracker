// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentsAPI, marksAPI, tasksAPI, habitsAPI } from '../utils/api';
import { FaUsers, FaTasks, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    tasks: 0,
    habits: 0,
    completedTasks: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentMarks, setRecentMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (!user) return;

      if (user.role === 'admin' || user.role === 'teacher') {
        // Fetch admin/teacher dashboard data
        const [studentsRes, tasksRes, habitsRes] = await Promise.all([
          studentsAPI.getAll({ limit: 10 }),
          tasksAPI.getAll({ completed: false }),
          habitsAPI.getAll({ isActive: true })
        ]);

        setStats({
          students: studentsRes.data.pagination?.total || 0,
          tasks: tasksRes.data.count || 0,
          habits: habitsRes.data.count || 0,
          completedTasks: 0
        });

        setRecentTasks(tasksRes.data.tasks?.slice(0, 5) || []);
      } else if (user.role === 'student') {
        // Fetch student dashboard data
        const [tasksRes, habitsRes, marksRes] = await Promise.all([
          tasksAPI.getAll({}),
          habitsAPI.getAll({ isActive: true }),
          user.studentId ? marksAPI.getStudentMarks(user.studentId) : Promise.resolve({ data: { marks: [] } })
        ]);

        const allTasks = tasksRes.data.tasks || [];
        const completedTasks = allTasks.filter(t => t.completed);

        setStats({
          students: 0,
          tasks: allTasks.length - completedTasks.length,
          habits: habitsRes.data.count || 0,
          completedTasks: completedTasks.length
        });

        setRecentTasks(allTasks.filter(t => !t.completed).slice(0, 5));
        setRecentMarks(marksRes.data.marks?.slice(0, 5) || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data for recent marks
  const marksChartData = {
    labels: recentMarks.slice(0, 7).reverse().map(m => m.subject.substring(0, 8)),
    datasets: [
      {
        label: 'Marks %',
        data: recentMarks.slice(0, 7).reverse().map(m => m.percentage),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3
      }
    ]
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  if (authLoading || (loading && user)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // ProtectedRoute will handle redirect
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-primary-100">
          {user.role === 'admin' && 'Manage your educational institution from here.'}
          {user.role === 'teacher' && 'Monitor student progress and manage classes.'}
          {user.role === 'student' && 'Track your academic progress and stay organized.'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(user.role === 'admin' || user.role === 'teacher') && (
          <StatCard
            icon={FaUsers}
            title="Total Students"
            value={stats.students}
            color="bg-blue-500"
          />
        )}
        <StatCard
          icon={FaTasks}
          title={user.role === 'student' ? 'Active Tasks' : 'Your Tasks'}
          value={stats.tasks}
          color="bg-green-500"
        />
        <StatCard
          icon={FaCalendarCheck}
          title="Active Habits"
          value={stats.habits}
          color="bg-purple-500"
        />
        {user.role === 'student' && (
          <StatCard
            icon={FaChartLine}
            title="Completed Tasks"
            value={stats.completedTasks}
            color="bg-orange-500"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
          {recentTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending tasks</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      {task.priority} • {task.category}
                    </p>
                  </div>
                  {task.dueDate && (
                    <span className="text-xs text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Marks or Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            {user.role === 'student' ? 'Recent Marks' : 'Quick Stats'}
          </h3>
          {user.role === 'student' ? (
            recentMarks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No marks recorded yet</p>
            ) : (
              <div className="space-y-3">
                {recentMarks.map((mark) => (
                  <div key={mark._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{mark.subject}</p>
                      <p className="text-xs text-gray-500">{mark.examName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{mark.percentage}%</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        mark.grade === 'A+' || mark.grade === 'A' ? 'bg-green-100 text-green-800' :
                        mark.grade === 'B+' || mark.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {mark.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Active Tasks</p>
                <p className="text-2xl font-bold text-blue-600">{stats.tasks}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Active Habits</p>
                <p className="text-2xl font-bold text-green-600">{stats.habits}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Marks Chart for Students */}
      {user.role === 'student' && recentMarks.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
          <Line data={marksChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(user.role === 'admin' || user.role === 'teacher') && (
            <a href="/students" className="btn btn-primary text-center">
              Manage Students
            </a>
          )}
          <a href="/tasks" className="btn btn-primary text-center">
            View Tasks
          </a>
          <a href="/habits" className="btn btn-primary text-center">
            Track Habits
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
