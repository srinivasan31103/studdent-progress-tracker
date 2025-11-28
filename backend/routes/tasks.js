// backend/routes/tasks.js
import express from 'express';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  toggleTask,
  deleteTask
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.put('/:id/toggle', toggleTask);
router.delete('/:id', deleteTask);

export default router;
