// backend/routes/ai.js
import express from 'express';
import {
  getStudyPlan,
  prioritizeUserTasks,
  getHabitTip,
  askAI
} from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/study-plan', getStudyPlan);
router.post('/prioritize', prioritizeUserTasks);
router.post('/habit-tip', getHabitTip);
router.post('/ask', askAI);

export default router;
