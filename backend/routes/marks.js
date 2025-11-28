// backend/routes/marks.js
import express from 'express';
import {
  addMark,
  getStudentMarks,
  bulkAddMarks,
  uploadMarksCSV,
  getAllMarks,
  updateMark,
  deleteMark
} from '../controllers/markController.js';
import { authenticate, authorize, authorizeStudentAccess } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', authorize('admin', 'teacher'), addMark);
router.get('/', authorize('admin', 'teacher'), getAllMarks);
router.get('/student/:id', authorizeStudentAccess, getStudentMarks);
router.post('/bulk', authorize('admin', 'teacher'), bulkAddMarks);
router.post('/upload', authorize('admin', 'teacher'), upload.single('file'), uploadMarksCSV);
router.put('/:id', authorize('admin', 'teacher'), updateMark);
router.delete('/:id', authorize('admin'), deleteMark);

export default router;
