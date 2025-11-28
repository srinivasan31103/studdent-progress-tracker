// backend/models/Mark.js
import mongoose from 'mongoose';

const markSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  examName: {
    type: String,
    required: [true, 'Exam name is required'],
    trim: true
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: -1  // -1 represents N/A (Not Applicable)
  },
  maxMarks: {
    type: Number,
    required: [true, 'Maximum marks are required'],
    min: 1
  },
  percentage: {
    type: Number
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C', 'D', 'F', 'N/A', ''],
    default: ''
  },
  examDate: {
    type: Date,
    default: Date.now
  },
  remarks: {
    type: String,
    trim: true,
    default: ''
  },
  aiSuggestion: {
    type: String,
    default: ''
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate percentage before saving
markSchema.pre('save', function(next) {
  if (this.marks !== undefined && this.maxMarks !== undefined) {
    // Check if subject is N/A (marks = -1)
    if (this.marks === -1) {
      this.percentage = -1;  // Special value for N/A
      this.grade = 'N/A';
    } else {
      this.percentage = ((this.marks / this.maxMarks) * 100).toFixed(2);

      // Auto-assign grade
      const pct = this.percentage;
      if (pct >= 90) this.grade = 'A+';
      else if (pct >= 80) this.grade = 'A';
      else if (pct >= 70) this.grade = 'B+';
      else if (pct >= 60) this.grade = 'B';
      else if (pct >= 50) this.grade = 'C';
      else if (pct >= 40) this.grade = 'D';
      else this.grade = 'F';
    }
  }
  next();
});

// Index for faster queries
markSchema.index({ student: 1, examDate: -1 });

const Mark = mongoose.model('Mark', markSchema);

export default Mark;
