// backend/controllers/markController.js
import Mark from '../models/Mark.js';
import Student from '../models/Student.js';
import { generateStudyPlan } from '../utils/claudeClient.js';
import fs from 'fs';
import csv from 'csv-parser';

// @desc    Add mark for a student
// @route   POST /api/marks
// @access  Private (teacher, admin)
export const addMark = async (req, res) => {
  try {
    const { student, subject, examName, marks, maxMarks, examDate, remarks } = req.body;

    // Validation
    if (!student || !subject || !examName || marks === undefined || !maxMarks) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
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

    // Create mark
    const mark = await Mark.create({
      student,
      subject,
      examName,
      marks,
      maxMarks,
      examDate: examDate || Date.now(),
      remarks,
      addedBy: req.user.id
    });

    // Generate AI study plan
    let aiSuggestion = '';
    try {
      aiSuggestion = await generateStudyPlan({
        studentName: studentDoc.name,
        subject,
        marks,
        maxMarks
      });
      mark.aiSuggestion = aiSuggestion;
      await mark.save();
    } catch (error) {
      console.error('AI suggestion error:', error);
    }

    await mark.populate('student', 'name rollNumber class');

    res.status(201).json({
      success: true,
      message: 'Mark added successfully',
      mark,
      aiSuggestion
    });
  } catch (error) {
    console.error('Add mark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add mark',
      error: error.message
    });
  }
};

// @desc    Get marks for a student
// @route   GET /api/marks/student/:id
// @access  Private
export const getStudentMarks = async (req, res) => {
  try {
    const studentId = req.params.id;

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

    const marks = await Mark.find({ student: studentId })
      .sort({ examDate: -1 })
      .populate('addedBy', 'name email');

    res.json({
      success: true,
      marks,
      count: marks.length
    });
  } catch (error) {
    console.error('Get student marks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marks',
      error: error.message
    });
  }
};

// @desc    Bulk add marks (from array or CSV)
// @route   POST /api/marks/bulk
// @access  Private (teacher, admin)
export const bulkAddMarks = async (req, res) => {
  try {
    const { marks } = req.body;

    if (!marks || !Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide marks array'
      });
    }

    const results = {
      success: [],
      failed: []
    };

    for (const markData of marks) {
      try {
        const { studentId, subject, examName, marks: score, maxMarks, examDate } = markData;

        // Validate required fields
        if (!studentId || !subject || !examName || score === undefined || !maxMarks) {
          results.failed.push({
            data: markData,
            error: 'Missing required fields'
          });
          continue;
        }

        // Verify student
        const student = await Student.findById(studentId);
        if (!student) {
          results.failed.push({
            data: markData,
            error: 'Student not found'
          });
          continue;
        }

        // Create mark
        const mark = await Mark.create({
          student: studentId,
          subject,
          examName,
          marks: score,
          maxMarks,
          examDate: examDate || Date.now(),
          addedBy: req.user.id
        });

        results.success.push(mark);
      } catch (error) {
        results.failed.push({
          data: markData,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Bulk import completed. ${results.success.length} succeeded, ${results.failed.length} failed.`,
      results
    });
  } catch (error) {
    console.error('Bulk add marks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk add marks',
      error: error.message
    });
  }
};

// @desc    Upload CSV and add marks
// @route   POST /api/marks/upload
// @access  Private (teacher, admin)
export const uploadMarksCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a CSV file'
      });
    }

    const results = {
      success: [],
      failed: []
    };

    // Parse CSV
    const marks = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        marks.push(row);
      })
      .on('end', async () => {
        // Process each row
        for (const row of marks) {
          try {
            const { studentId, subject, examName, marks: score, maxMarks, examDate } = row;

            // Validate
            if (!studentId || !subject || !examName || !score || !maxMarks) {
              results.failed.push({
                data: row,
                error: 'Missing required fields'
              });
              continue;
            }

            // Find student
            const student = await Student.findById(studentId);
            if (!student) {
              results.failed.push({
                data: row,
                error: 'Student not found'
              });
              continue;
            }

            // Create mark
            const mark = await Mark.create({
              student: studentId,
              subject,
              examName,
              marks: parseFloat(score),
              maxMarks: parseFloat(maxMarks),
              examDate: examDate ? new Date(examDate) : Date.now(),
              addedBy: req.user.id
            });

            results.success.push(mark);
          } catch (error) {
            results.failed.push({
              data: row,
              error: error.message
            });
          }
        }

        // Delete uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
          success: true,
          message: `CSV import completed. ${results.success.length} succeeded, ${results.failed.length} failed.`,
          results
        });
      });
  } catch (error) {
    console.error('Upload CSV error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload CSV',
      error: error.message
    });
  }
};

// @desc    Get all marks
// @route   GET /api/marks
// @access  Private (teacher, admin)
export const getAllMarks = async (req, res) => {
  try {
    const { subject, examName, class: className, page = 1, limit = 50 } = req.query;

    const query = {};
    if (subject) query.subject = subject;
    if (examName) query.examName = examName;

    const skip = (page - 1) * limit;

    const marks = await Mark.find(query)
      .populate('student', 'name rollNumber class section')
      .sort({ examDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Mark.countDocuments(query);

    res.json({
      success: true,
      marks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all marks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marks',
      error: error.message
    });
  }
};

// @desc    Update mark
// @route   PUT /api/marks/:id
// @access  Private (teacher, admin)
export const updateMark = async (req, res) => {
  try {
    const mark = await Mark.findById(req.params.id);

    if (!mark) {
      return res.status(404).json({
        success: false,
        message: 'Mark not found'
      });
    }

    const { marks, maxMarks, examName, subject, examDate, remarks } = req.body;

    if (marks !== undefined) mark.marks = marks;
    if (maxMarks !== undefined) mark.maxMarks = maxMarks;
    if (examName) mark.examName = examName;
    if (subject) mark.subject = subject;
    if (examDate) mark.examDate = examDate;
    if (remarks !== undefined) mark.remarks = remarks;

    await mark.save();

    res.json({
      success: true,
      message: 'Mark updated successfully',
      mark
    });
  } catch (error) {
    console.error('Update mark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mark',
      error: error.message
    });
  }
};

// @desc    Delete mark
// @route   DELETE /api/marks/:id
// @access  Private (admin)
export const deleteMark = async (req, res) => {
  try {
    const mark = await Mark.findById(req.params.id);

    if (!mark) {
      return res.status(404).json({
        success: false,
        message: 'Mark not found'
      });
    }

    await mark.deleteOne();

    res.json({
      success: true,
      message: 'Mark deleted successfully'
    });
  } catch (error) {
    console.error('Delete mark error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete mark',
      error: error.message
    });
  }
};
