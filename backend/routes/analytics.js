// backend/routes/analytics.js
import express from 'express';
import {
  getDashboardAnalytics,
  getStudentAnalytics,
  getClassAnalytics,
  getTaskAnalytics,
  getHabitAnalytics
} from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/dashboard', authorize('admin', 'teacher'), getDashboardAnalytics);
router.get('/student/:id', getStudentAnalytics);
router.get('/class/:className', authorize('admin', 'teacher'), getClassAnalytics);
router.get('/tasks', getTaskAnalytics);
router.get('/habits', getHabitAnalytics);

export default router;
