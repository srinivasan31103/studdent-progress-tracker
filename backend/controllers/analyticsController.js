// backend/controllers/analyticsController.js
import Student from '../models/Student.js';
import Mark from '../models/Mark.js';
import Attendance from '../models/Attendance.js';
import Task from '../models/Task.js';
import Habit from '../models/Habit.js';
import User from '../models/User.js';

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private (admin, teacher)
export const getDashboardAnalytics = async (req, res) => {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalMarks,
      totalAttendance,
      activeStudents
    ] = await Promise.all([
      Student.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'teacher', isActive: true }),
      Mark.countDocuments(),
      Attendance.countDocuments(),
      Student.countDocuments({ isActive: true, updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
    ]);

    // Get average marks by subject
    const subjectAverages = await Mark.aggregate([
      {
        $group: {
          _id: '$subject',
          avgPercentage: { $avg: '$percentage' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { avgPercentage: -1 }
      }
    ]);

    // Get attendance statistics
    const attendanceStats = await Attendance.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get grade distribution
    const gradeDistribution = await Mark.aggregate([
      {
        $group: {
          _id: '$grade',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActivity = {
      marksAdded: await Mark.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      attendanceMarked: await Attendance.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      newStudents: await Student.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    };

    // Get monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyMarks = await Mark.aggregate([
      {
        $match: { createdAt: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          avgPercentage: { $avg: '$percentage' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        overview: {
          totalStudents,
          totalTeachers,
          totalMarks,
          totalAttendance,
          activeStudents
        },
        subjectPerformance: subjectAverages,
        attendanceStats,
        gradeDistribution,
        recentActivity,
        monthlyTrends: monthlyMarks
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// @desc    Get student performance analytics
// @route   GET /api/analytics/student/:id
// @access  Private
export const getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get all marks
    const marks = await Mark.find({ student: studentId }).sort({ examDate: -1 });

    // Calculate overall performance
    const totalMarks = marks.reduce((sum, mark) => sum + mark.marks, 0);
    const totalMaxMarks = marks.reduce((sum, mark) => sum + mark.maxMarks, 0);
    const overallPercentage = totalMaxMarks > 0 ? ((totalMarks / totalMaxMarks) * 100).toFixed(2) : 0;

    // Subject-wise performance
    const subjectPerformance = marks.reduce((acc, mark) => {
      if (!acc[mark.subject]) {
        acc[mark.subject] = {
          subject: mark.subject,
          marks: [],
          avgPercentage: 0,
          highest: 0,
          lowest: 100
        };
      }

      acc[mark.subject].marks.push(mark.percentage);
      acc[mark.subject].highest = Math.max(acc[mark.subject].highest, mark.percentage);
      acc[mark.subject].lowest = Math.min(acc[mark.subject].lowest, mark.percentage);

      return acc;
    }, {});

    // Calculate averages
    Object.values(subjectPerformance).forEach(subject => {
      const sum = subject.marks.reduce((a, b) => a + b, 0);
      subject.avgPercentage = (sum / subject.marks.length).toFixed(2);
    });

    // Get attendance statistics
    const attendanceRecords = await Attendance.find({ student: studentId });
    const attendanceStats = {
      total: attendanceRecords.length,
      present: attendanceRecords.filter(a => a.status === 'present').length,
      absent: attendanceRecords.filter(a => a.status === 'absent').length,
      late: attendanceRecords.filter(a => a.status === 'late').length,
      excused: attendanceRecords.filter(a => a.status === 'excused').length
    };

    attendanceStats.attendancePercentage = attendanceStats.total > 0
      ? ((attendanceStats.present / attendanceStats.total) * 100).toFixed(2)
      : 0;

    // Performance trend (last 10 marks)
    const recentMarks = marks.slice(0, 10).reverse();
    const trend = {
      labels: recentMarks.map(m => `${m.subject.substring(0, 3)} (${new Date(m.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`),
      data: recentMarks.map(m => m.percentage)
    };

    // Identify strengths and weaknesses
    const subjectArray = Object.values(subjectPerformance);
    const strengths = subjectArray.filter(s => parseFloat(s.avgPercentage) >= 75).map(s => s.subject);
    const weaknesses = subjectArray.filter(s => parseFloat(s.avgPercentage) < 60).map(s => s.subject);

    // Calculate improvement areas
    const improvementSuggestions = weaknesses.map(subject => ({
      subject,
      suggestion: `Focus on ${subject} - current average is below 60%`,
      priority: 'high'
    }));

    res.json({
      success: true,
      analytics: {
        student: {
          name: student.name,
          rollNumber: student.rollNumber,
          class: student.class
        },
        overall: {
          totalExams: marks.length,
          overallPercentage,
          totalMarks,
          totalMaxMarks
        },
        subjectPerformance: Object.values(subjectPerformance),
        attendanceStats,
        performanceTrend: trend,
        insights: {
          strengths,
          weaknesses,
          improvementAreas: improvementSuggestions
        }
      }
    });
  } catch (error) {
    console.error('Get student analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student analytics',
      error: error.message
    });
  }
};

// @desc    Get class performance comparison
// @route   GET /api/analytics/class/:className
// @access  Private (admin, teacher)
export const getClassAnalytics = async (req, res) => {
  try {
    const { className } = req.params;

    const students = await Student.find({ class: className, isActive: true });
    const studentIds = students.map(s => s._id);

    // Get marks for all students in class
    const marks = await Mark.find({ student: { $in: studentIds } });

    // Calculate class average
    const totalPercentage = marks.reduce((sum, mark) => sum + mark.percentage, 0);
    const classAverage = marks.length > 0 ? (totalPercentage / marks.length).toFixed(2) : 0;

    // Subject-wise class performance
    const subjectPerformance = marks.reduce((acc, mark) => {
      if (!acc[mark.subject]) {
        acc[mark.subject] = {
          subject: mark.subject,
          percentages: [],
          count: 0
        };
      }

      acc[mark.subject].percentages.push(mark.percentage);
      acc[mark.subject].count++;

      return acc;
    }, {});

    // Calculate subject averages
    const subjectAverages = Object.entries(subjectPerformance).map(([subject, data]) => {
      const avg = data.percentages.reduce((a, b) => a + b, 0) / data.percentages.length;
      return {
        subject,
        average: avg.toFixed(2),
        exams: data.count,
        highest: Math.max(...data.percentages).toFixed(2),
        lowest: Math.min(...data.percentages).toFixed(2)
      };
    }).sort((a, b) => b.average - a.average);

    // Top performers
    const studentPerformance = {};
    marks.forEach(mark => {
      const studentId = mark.student.toString();
      if (!studentPerformance[studentId]) {
        studentPerformance[studentId] = {
          totalPercentage: 0,
          count: 0
        };
      }
      studentPerformance[studentId].totalPercentage += mark.percentage;
      studentPerformance[studentId].count++;
    });

    const topPerformers = Object.entries(studentPerformance)
      .map(([studentId, data]) => {
        const student = students.find(s => s._id.toString() === studentId);
        return {
          studentId,
          name: student?.name,
          rollNumber: student?.rollNumber,
          average: (data.totalPercentage / data.count).toFixed(2)
        };
      })
      .sort((a, b) => b.average - a.average)
      .slice(0, 10);

    // Get attendance stats for class
    const attendance = await Attendance.find({ student: { $in: studentIds } });
    const attendanceStats = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      classAttendanceRate: 0
    };

    attendanceStats.classAttendanceRate = attendanceStats.total > 0
      ? ((attendanceStats.present / attendanceStats.total) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      analytics: {
        class: className,
        totalStudents: students.length,
        classAverage,
        subjectPerformance: subjectAverages,
        topPerformers,
        attendanceStats
      }
    });
  } catch (error) {
    console.error('Get class analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch class analytics',
      error: error.message
    });
  }
};

// @desc    Get task analytics for user
// @route   GET /api/analytics/tasks
// @access  Private
export const getTaskAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({ user: userId });

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      overdue: tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
    };

    // Priority distribution
    const priorityDist = {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
      urgent: tasks.filter(t => t.priority === 'urgent').length
    };

    // Category distribution
    const categoryDist = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});

    // Completion rate
    const completionRate = stats.total > 0
      ? ((stats.completed / stats.total) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      analytics: {
        stats,
        priorityDistribution: priorityDist,
        categoryDistribution: categoryDist,
        completionRate,
        productivity: {
          onTime: stats.completed - stats.overdue,
          overdue: stats.overdue,
          efficiency: completionRate
        }
      }
    });
  } catch (error) {
    console.error('Get task analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task analytics',
      error: error.message
    });
  }
};

// @desc    Get habit analytics for user
// @route   GET /api/analytics/habits
// @access  Private
export const getHabitAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const habits = await Habit.find({ user: userId, isActive: true });

    const stats = {
      totalHabits: habits.length,
      totalCompletions: habits.reduce((sum, h) => sum + h.totalCompletions, 0),
      averageStreak: habits.length > 0
        ? (habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length).toFixed(1)
        : 0,
      longestStreak: Math.max(...habits.map(h => h.longestStreak), 0)
    };

    // Habit consistency
    const consistencyScores = habits.map(habit => ({
      name: habit.name,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
      totalCompletions: habit.totalCompletions,
      consistency: habit.longestStreak > 0
        ? ((habit.currentStreak / habit.longestStreak) * 100).toFixed(2)
        : 0
    }));

    res.json({
      success: true,
      analytics: {
        stats,
        habits: consistencyScores,
        insights: {
          strongestHabit: consistencyScores.reduce((max, h) =>
            h.currentStreak > (max?.currentStreak || 0) ? h : max, null
          ),
          needsAttention: consistencyScores.filter(h => h.currentStreak === 0)
        }
      }
    });
  } catch (error) {
    console.error('Get habit analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch habit analytics',
      error: error.message
    });
  }
};
