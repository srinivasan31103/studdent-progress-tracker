// backend/models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['work', 'study', 'personal', 'project', 'other'],
    default: 'other'
  },
  dueDate: {
    type: Date,
    default: null
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  aiPriority: {
    type: Number,
    default: 0
  },
  aiReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
taskSchema.index({ user: 1, completed: 1, dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
