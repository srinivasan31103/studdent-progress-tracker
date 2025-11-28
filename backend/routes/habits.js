// backend/routes/habits.js
import express from 'express';
import {
  createHabit,
  getHabits,
  getHabit,
  updateHabit,
  markHabitDone,
  deleteHabit
} from '../controllers/habitController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createHabit);
router.get('/', getHabits);
router.get('/:id', getHabit);
router.put('/:id', updateHabit);
router.put('/:id/done', markHabitDone);
router.delete('/:id', deleteHabit);

export default router;
