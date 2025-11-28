// backend/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d' // Reduced from 30d to 7d for better security
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Input length validation
    if (name.length > 100 || email.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name and email must be less than 100 characters'
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    if (password.length > 128) {
      return res.status(400).json({
        success: false,
        message: 'Password must be less than 128 characters'
      });
    }

    // Check password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      });
    }

    // Normalize email to lowercase for consistent lookup
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // SECURITY FIX: Always assign 'student' role by default, ignore client input
    // Only admins can create users with other roles via admin panel
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'student'
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Normalize email to lowercase (User schema stores emails in lowercase)
    const normalizedEmail = email.toLowerCase().trim();

    // Find user (include password for comparison)
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user is a student, fetch student details
    let studentDetails = null;
    if (user.role === 'student' && user.studentId) {
      studentDetails = await Student.findById(user.studentId);
    }

    res.json({
      success: true,
      user,
      studentDetails
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email, profileImage } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check email uniqueness if changing email
    if (email && email.toLowerCase().trim() !== user.email) {
      const normalizedEmail = email.toLowerCase().trim();
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user.id }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use by another account'
        });
      }
      user.email = normalizedEmail;
    }

    // Update other fields
    if (name) user.name = name.trim();
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};
