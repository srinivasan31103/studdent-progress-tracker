// backend/routes/students.js
import express from 'express';
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', authorize('admin', 'teacher'), createStudent);
router.get('/', authorize('admin', 'teacher'), getStudents);
router.get('/:id', getStudentById); // All authenticated users can view (with restrictions)
router.put('/:id', authorize('admin', 'teacher'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

export default router;
