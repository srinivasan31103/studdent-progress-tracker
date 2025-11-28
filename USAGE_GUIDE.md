# EduFlow Suite - Complete Usage Guide with Advanced Features

## 🚀 Quick Start with New Features

### 1. Starting the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open: **http://localhost:5173**

---

## 🎨 Using New Animations

### Basic Animation Classes

```jsx
// Fade in animation
<div className="animate-fadeIn">
  Content fades in smoothly
</div>

// Fade in with upward motion
<div className="animate-fadeInUp">
  Content slides up while fading in
</div>

// Scale in animation
<div className="animate-scaleIn">
  Content scales from center
</div>
```

### Stagger Animation for Lists

```jsx
// Animate children with delay
<div className="stagger-children">
  <div>Item 1</div> {/* Delays 0.1s */}
  <div>Item 2</div> {/* Delays 0.2s */}
  <div>Item 3</div> {/* Delays 0.3s */}
</div>
```

**Example in Students List**:
```jsx
<div className="stagger-children">
  {students.map(student => (
    <div key={student._id} className="card hover-lift">
      {student.name}
    </div>
  ))}
</div>
```

### Hover Effects

```jsx
// Card that lifts on hover
<div className="card hover-lift">
  Hover over me!
</div>

// Scale effect
<div className="card hover-scale">
  Scales up on hover
</div>

// Glow effect
<button className="btn btn-primary hover-glow">
  Glows on hover
</button>
```

---

## 🎨 Using Gradients

### Gradient Buttons

```jsx
// Primary gradient (purple)
<button className="btn btn-primary">
  Primary Action
</button>

// Success gradient (green)
<button className="btn btn-success">
  Confirm
</button>

// Danger gradient (red)
<button className="btn btn-danger">
  Delete
</button>
```

### Gradient Cards

```jsx
// Card with gradient border
<div className="card card-gradient">
  Beautiful gradient border
</div>

// Glass morphism effect
<div className="card glass">
  Frosted glass background
</div>
```

### Gradient Text

```jsx
// Static gradient text
<h1 className="text-gradient">
  Beautiful Gradient Title
</h1>

// Animated gradient text
<h1 className="text-gradient-animated">
  Flowing Gradient Title
</h1>
```

### Gradient Backgrounds

```jsx
// Apply gradient background
<div className="gradient-primary p-6 text-white">
  Purple gradient background
</div>

<div className="gradient-blue p-6 text-white">
  Blue gradient background
</div>

// Animated flowing gradient
<div className="gradient-animated p-6 text-white">
  Animated gradient background
</div>
```

---

## 📊 Using Analytics

### 1. Dashboard Analytics (Admin/Teacher)

```jsx
import { analyticsAPI } from '../utils/api';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await analyticsAPI.getDashboard();
        setAnalytics(response.data.analytics);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analytics) return <div className="spinner"></div>;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <h3>Total Students</h3>
          <p className="text-3xl font-bold text-gradient">
            {analytics.overview.totalStudents}
          </p>
        </div>
        {/* More stat cards... */}
      </div>

      {/* Subject Performance Chart */}
      <div className="card">
        <h3>Subject Performance</h3>
        <Bar data={subjectChartData} />
      </div>
    </div>
  );
};
```

### 2. Student Analytics

```jsx
const StudentProfile = ({ studentId }) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchStudentAnalytics = async () => {
      const response = await analyticsAPI.getStudent(studentId);
      setAnalytics(response.data.analytics);
    };

    fetchStudentAnalytics();
  }, [studentId]);

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <div className="card gradient-primary text-white">
        <h2>Overall Performance</h2>
        <div className="text-5xl font-bold">
          {analytics.overall.overallPercentage}%
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-green-600">Strengths</h3>
          {analytics.insights.strengths.map(subject => (
            <span key={subject} className="badge badge-success">
              {subject}
            </span>
          ))}
        </div>

        <div className="card">
          <h3 className="text-red-600">Needs Improvement</h3>
          {analytics.insights.weaknesses.map(subject => (
            <span key={subject} className="badge badge-danger">
              {subject}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### 3. Task Analytics

```jsx
const TaskDashboard = () => {
  const [taskAnalytics, setTaskAnalytics] = useState(null);

  useEffect(() => {
    const fetchTaskAnalytics = async () => {
      const response = await analyticsAPI.getTasks();
      setTaskAnalytics(response.data.analytics);
    };

    fetchTaskAnalytics();
  }, []);

  return (
    <div className="card">
      <h2>Your Productivity</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card gradient-blue text-white">
          <div className="text-2xl font-bold">
            {taskAnalytics.stats.total}
          </div>
          <div>Total Tasks</div>
        </div>

        <div className="stat-card gradient-green text-white">
          <div className="text-2xl font-bold">
            {taskAnalytics.stats.completed}
          </div>
          <div>Completed</div>
        </div>

        <div className="stat-card gradient-orange text-white">
          <div className="text-2xl font-bold">
            {taskAnalytics.stats.pending}
          </div>
          <div>Pending</div>
        </div>

        <div className="stat-card gradient-red text-white">
          <div className="text-2xl font-bold">
            {taskAnalytics.stats.overdue}
          </div>
          <div>Overdue</div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="mt-6">
        <h3>Completion Rate</h3>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{width: `${taskAnalytics.completionRate}%`}}
          />
        </div>
        <p className="text-center mt-2 text-2xl font-bold text-gradient">
          {taskAnalytics.completionRate}%
        </p>
      </div>
    </div>
  );
};
```

### 4. Habit Analytics

```jsx
const HabitInsights = () => {
  const [habitAnalytics, setHabitAnalytics] = useState(null);

  useEffect(() => {
    const fetchHabitAnalytics = async () => {
      const response = await analyticsAPI.getHabits();
      setHabitAnalytics(response.data.analytics);
    };

    fetchHabitAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="card gradient-animated text-white">
        <h2>Habit Consistency</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <div className="text-3xl font-bold">
              {habitAnalytics.stats.totalHabits}
            </div>
            <div>Active Habits</div>
          </div>

          <div>
            <div className="text-3xl font-bold">
              {habitAnalytics.stats.averageStreak}
            </div>
            <div>Avg Streak</div>
          </div>

          <div>
            <div className="text-3xl font-bold">
              {habitAnalytics.stats.longestStreak}
            </div>
            <div>Best Streak</div>
          </div>
        </div>
      </div>

      {/* Strongest Habit */}
      {habitAnalytics.insights.strongestHabit && (
        <div className="card border-4 border-green-500 animate-glow">
          <h3 className="text-green-600">🏆 Your Strongest Habit</h3>
          <div className="text-2xl font-bold">
            {habitAnalytics.insights.strongestHabit.name}
          </div>
          <div className="text-gray-600">
            {habitAnalytics.insights.strongestHabit.currentStreak} day streak!
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 📧 Using Email Notifications

### Setup (One-time)

1. **Get Gmail App Password**:
   - Go to Google Account → Security
   - Enable 2-Factor Authentication
   - Generate App Password

2. **Configure Backend**:
   ```env
   # backend/.env
   MAIL_USER=your-email@gmail.com
   MAIL_PASS=your-16-digit-app-password
   ```

3. **Restart Backend**:
   ```bash
   cd backend
   npm run dev
   ```

### Sending Emails (Backend)

#### 1. Welcome Email on Registration

```javascript
// In authController.js register function
import { sendEmail } from '../utils/emailService.js';

export const register = async (req, res) => {
  // ... user creation code ...

  // Send welcome email
  await sendEmail(
    user.email,
    'welcomeEmail',
    {
      userName: user.name,
      userEmail: user.email,
      userRole: user.role
    }
  );

  // ... rest of code ...
};
```

#### 2. Marks Notification

```javascript
// In markController.js addMark function
export const addMark = async (req, res) => {
  // ... mark creation code ...

  // Send email to student
  await sendEmail(
    studentDoc.email,
    'marksAdded',
    {
      studentName: studentDoc.name,
      subject: mark.subject,
      marks: mark.marks,
      maxMarks: mark.maxMarks,
      examName: mark.examName
    }
  );

  // Optional: Send to parent
  if (studentDoc.parentEmail) {
    await sendEmail(
      studentDoc.parentEmail,
      'marksAdded',
      {
        studentName: studentDoc.name,
        subject, marks, maxMarks, examName
      }
    );
  }
};
```

#### 3. Attendance Alert

```javascript
// In attendanceController.js markAttendance function
export const markAttendance = async (req, res) => {
  // ... attendance creation code ...

  // Send alert if absent
  if (attendance.status === 'absent' && studentDoc.parentEmail) {
    await sendEmail(
      studentDoc.parentEmail,
      'attendanceAlert',
      {
        studentName: studentDoc.name,
        status: attendance.status,
        date: attendance.date,
        parentName: studentDoc.parentName
      }
    );
  }
};
```

#### 4. Task Reminder

```javascript
// Create a cron job or scheduled task
import { sendEmail } from './utils/emailService.js';
import Task from './models/Task.js';
import User from './models/User.js';

const sendTaskReminders = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks = await Task.find({
    completed: false,
    dueDate: { $lte: tomorrow }
  }).populate('user');

  // Group by user
  const userTasks = {};
  tasks.forEach(task => {
    const userId = task.user._id.toString();
    if (!userTasks[userId]) {
      userTasks[userId] = {
        user: task.user,
        tasks: []
      };
    }
    userTasks[userId].tasks.push(task);
  });

  // Send emails
  for (const [userId, data] of Object.entries(userTasks)) {
    await sendEmail(
      data.user.email,
      'taskReminder',
      {
        userName: data.user.name,
        tasks: data.tasks
      }
    );
  }
};
```

---

## 🎭 Advanced UI Patterns

### Loading Skeleton

```jsx
const StudentList = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="card">
            <div className="skeleton h-6 w-1/3 mb-2"></div>
            <div className="skeleton h-4 w-full mb-2"></div>
            <div className="skeleton h-4 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stagger-children">
      {students.map(student => (
        <div key={student._id} className="card hover-lift">
          {/* Student content */}
        </div>
      ))}
    </div>
  );
};
```

### Success Notification

```jsx
const SuccessNotification = ({ message, onClose }) => {
  return (
    <div className="alert alert-success animate-fadeInRight">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="success-check">✓</div>
          <span>{message}</span>
        </div>
        <button onClick={onClose} className="text-green-800 hover:text-green-900">
          ×
        </button>
      </div>
    </div>
  );
};

// Usage
const [showSuccess, setShowSuccess] = useState(false);

const handleSubmit = async () => {
  // ... submit logic ...
  setShowSuccess(true);
  setTimeout(() => setShowSuccess(false), 3000);
};

return (
  <div>
    {showSuccess && (
      <SuccessNotification
        message="Data saved successfully!"
        onClose={() => setShowSuccess(false)}
      />
    )}
  </div>
);
```

### Interactive Card

```jsx
const InteractiveStudentCard = ({ student }) => {
  return (
    <div className="card card-interactive hover-lift">
      <div className="flex items-center gap-4">
        <div className="avatar avatar-gradient">
          <img src={student.profileImage || '/default-avatar.png'} alt={student.name} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gradient">
            {student.name}
          </h3>
          <p className="text-gray-600">{student.rollNumber}</p>
        </div>

        <div>
          <span className="badge badge-primary">
            {student.class}
          </span>
        </div>
      </div>
    </div>
  );
};
```

### Progress Indicator

```jsx
const ProgressIndicator = ({ value, max, label }) => {
  const percentage = (value / max) * 100;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-gray-600">{value}/{max}</span>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{width: `${percentage}%`}}
        />
      </div>

      <p className="text-center mt-2 font-semibold text-gradient">
        {percentage.toFixed(1)}%
      </p>
    </div>
  );
};

// Usage
<ProgressIndicator
  value={attendanceStats.present}
  max={attendanceStats.total}
  label="Attendance Rate"
/>
```

---

## 🎯 Best Practices

### 1. Use Animations Sparingly
```jsx
// Good - Subtle animations
<div className="animate-fadeInUp">
  Content
</div>

// Avoid - Too many animations
<div className="animate-pulse animate-bounce animate-glow">
  Overwhelming!
</div>
```

### 2. Consistent Gradient Usage
```jsx
// Good - Consistent color scheme
<button className="btn btn-primary">Primary</button>
<div className="badge badge-primary">Badge</div>

// Avoid - Random colors
<button className="btn btn-primary">Primary</button>
<div className="badge badge-danger">Badge</div>  // Confusing
```

### 3. Loading States
```jsx
// Always provide loading states
{loading ? (
  <div className="spinner"></div>
) : (
  <DataDisplay data={data} />
)}
```

### 4. Error Handling
```jsx
// Show user-friendly errors
{error && (
  <div className="alert alert-error animate-fadeInDown">
    {error.message || 'An error occurred'}
  </div>
)}
```

---

## 📱 Mobile Responsiveness

All features are mobile-responsive. Test with:

```jsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards */}
</div>

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient">
  Responsive Title
</h1>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>
```

---

## 🎉 Complete Example

Here's a complete example combining all features:

```jsx
import { useState, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';

const AdvancedDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboard();
      setAnalytics(response.data.analytics);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-64 w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {showSuccess && (
        <div className="alert alert-success animate-fadeInDown">
          ✅ Analytics loaded successfully!
        </div>
      )}

      {/* Header with gradient */}
      <div className="card gradient-primary text-white animate-fadeInUp">
        <h1 className="text-3xl font-bold">Advanced Dashboard</h1>
        <p className="text-primary-100">Real-time analytics and insights</p>
      </div>

      {/* Stats Grid with stagger animation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger-children">
        <div className="card hover-lift">
          <div className="stat-card-icon gradient-blue">
            👥
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-gradient">
              {analytics.overview.totalStudents}
            </div>
            <div className="text-gray-600">Total Students</div>
          </div>
        </div>

        {/* More stat cards... */}
      </div>

      {/* Charts with animation */}
      <div className="card animate-fadeInUp">
        <h2 className="text-xl font-semibold text-gradient mb-4">
          Performance Trends
        </h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Interactive list */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gradient mb-4">
          Top Performers
        </h2>
        <div className="space-y-2 stagger-children">
          {analytics.topPerformers.map((student, index) => (
            <div
              key={student.id}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 transition-all hover-lift"
            >
              <div className="text-2xl font-bold text-gradient">
                #{index + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{student.name}</div>
                <div className="text-sm text-gray-600">{student.rollNumber}</div>
              </div>
              <div>
                <span className="badge badge-success">
                  {student.average}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;
```

---

**Happy coding with your enhanced EduFlow Suite!** 🎓✨🚀
