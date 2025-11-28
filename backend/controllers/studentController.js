// backend/controllers/studentController.js
import Student from '../models/Student.js';
import User from '../models/User.js';

// @desc    Create new student
// @route   POST /api/students
// @access  Private (admin, teacher)
export const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      rollNumber,
      class: className,
      section,
      dateOfBirth,
      parentName,
      parentEmail,
      parentPhone,
      address
    } = req.body;

    // Validation
    if (!name || !email || !rollNumber || !className) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, rollNumber, class)'
      });
    }

    // Check if student with email or roll number already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNumber }]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or roll number already exists'
      });
    }

    // Create student
    const student = await Student.create({
      name,
      email,
      rollNumber,
      class: className,
      section: section || 'A',
      dateOfBirth,
      parentName,
      parentEmail,
      parentPhone,
      address
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      student
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create student',
      error: error.message
    });
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private (admin, teacher)
export const getStudents = async (req, res) => {
  try {
    const { class: className, section, search, page = 1, limit = 20 } = req.query;

    // Build query
    const query = { isActive: true };

    if (className) query.class = className;
    if (section) query.section = section;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(query);

    res.json({
      success: true,
      students,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check authorization
    if (req.user.role === 'student') {
      // Students can only view their own profile
      if (req.user.studentId?.toString() !== student._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      student
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
      error: error.message
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (admin, teacher)
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const {
      name,
      email,
      rollNumber,
      class: className,
      section,
      dateOfBirth,
      parentName,
      parentEmail,
      parentPhone,
      address,
      profileImage,
      isActive
    } = req.body;

    // Update fields
    if (name) student.name = name;
    if (email) student.email = email;
    if (rollNumber) student.rollNumber = rollNumber;
    if (className) student.class = className;
    if (section) student.section = section;
    if (dateOfBirth) student.dateOfBirth = dateOfBirth;
    if (parentName) student.parentName = parentName;
    if (parentEmail) student.parentEmail = parentEmail;
    if (parentPhone) student.parentPhone = parentPhone;
    if (address) student.address = address;
    if (profileImage) student.profileImage = profileImage;
    if (isActive !== undefined) student.isActive = isActive;

    await student.save();

    res.json({
      success: true,
      message: 'Student updated successfully',
      student
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (admin only)
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Soft delete - set isActive to false
    student.isActive = false;
    await student.save();

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message
    });
  }
};
