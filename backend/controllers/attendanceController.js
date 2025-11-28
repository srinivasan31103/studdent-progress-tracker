// backend/controllers/attendanceController.js
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private (teacher, admin)
export const markAttendance = async (req, res) => {
  try {
    const { student, date, status, subject, remarks } = req.body;

    // Validation
    if (!student || !status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student and status'
      });
    }

    // Verify student exists
    const studentDoc = await Student.findById(student);
    if (!studentDoc) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      student,
      date: date || Date.now(),
      status,
      subject: subject || 'General',
      remarks,
      markedBy: req.user.id
    });

    await attendance.populate('student', 'name rollNumber class');

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('Mark attendance error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this student on this date'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
};

// @desc    Get attendance for a student
// @route   GET /api/attendance/student/:id
// @access  Private
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { startDate, endDate, subject } = req.query;

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Authorization check
    if (req.user.role === 'student') {
      if (req.user.studentId?.toString() !== studentId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    // Build query
    const query = { student: studentId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (subject) {
      query.subject = subject;
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('markedBy', 'name email');

    // Calculate statistics
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const excused = attendance.filter(a => a.status === 'excused').length;
    const attendancePercentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      attendance,
      statistics: {
        total,
        present,
        absent,
        late,
        excused,
        attendancePercentage
      }
    });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
      error: error.message
    });
  }
};

// @desc    Bulk mark attendance
// @route   POST /api/attendance/bulk
// @access  Private (teacher, admin)
export const bulkMarkAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body;

    if (!attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide attendance data array'
      });
    }

    const results = {
      success: [],
      failed: []
    };

    for (const data of attendanceData) {
      try {
        const { studentId, date, status, subject, remarks } = data;

        if (!studentId || !status) {
          results.failed.push({
            data,
            error: 'Missing required fields'
          });
          continue;
        }

        const attendance = await Attendance.create({
          student: studentId,
          date: date || Date.now(),
          status,
          subject: subject || 'General',
          remarks,
          markedBy: req.user.id
        });

        results.success.push(attendance);
      } catch (error) {
        results.failed.push({
          data,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Bulk attendance completed. ${results.success.length} succeeded, ${results.failed.length} failed.`,
      results
    });
  } catch (error) {
    console.error('Bulk mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk mark attendance',
      error: error.message
    });
  }
};

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private (teacher, admin)
export const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    const { status, remarks } = req.body;

    if (status) attendance.status = status;
    if (remarks !== undefined) attendance.remarks = remarks;

    await attendance.save();

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      attendance
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance',
      error: error.message
    });
  }
};

// @desc    Delete attendance
// @route   DELETE /api/attendance/:id
// @access  Private (admin)
export const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    await attendance.deleteOne();

    res.json({
      success: true,
      message: 'Attendance deleted successfully'
    });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete attendance',
      error: error.message
    });
  }
};
