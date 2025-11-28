// backend/routes/attendance.js
import express from 'express';
import {
  markAttendance,
  getStudentAttendance,
  bulkMarkAttendance,
  updateAttendance,
  deleteAttendance
} from '../controllers/attendanceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', authorize('admin', 'teacher'), markAttendance);
router.get('/student/:id', getStudentAttendance);
router.post('/bulk', authorize('admin', 'teacher'), bulkMarkAttendance);
router.put('/:id', authorize('admin', 'teacher'), updateAttendance);
router.delete('/:id', authorize('admin'), deleteAttendance);

export default router;
