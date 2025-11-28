# EduFlow Suite - API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### Login
**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "admin@eduflow.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Admin User",
    "email": "admin@eduflow.com",
    "role": "admin",
    "studentId": null
  }
}
```

---

### Get Current User
**GET** `/api/auth/me`

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Admin User",
    "email": "admin@eduflow.com",
    "role": "admin"
  },
  "studentDetails": null
}
```

---

### Update Profile
**PUT** `/api/auth/profile`

**Headers:** Authorization required

**Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "profileImage": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

---

## Student Endpoints

### Create Student
**POST** `/api/students`

**Headers:** Authorization required (admin/teacher)

**Body:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@student.com",
  "rollNumber": "STU001",
  "class": "10th Grade",
  "section": "A",
  "dateOfBirth": "2008-05-15",
  "parentName": "Robert Johnson",
  "parentEmail": "robert@parent.com",
  "parentPhone": "555-0101",
  "address": "123 Main St, City, State"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student created successfully",
  "student": { /* student object */ }
}
```

---

### Get All Students
**GET** `/api/students`

**Headers:** Authorization required (admin/teacher)

**Query Parameters:**
- `class` (optional): Filter by class
- `section` (optional): Filter by section
- `search` (optional): Search by name, email, or roll number
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example:** `/api/students?class=10th Grade&search=alice&page=1&limit=10`

**Response:**
```json
{
  "success": true,
  "students": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Alice Johnson",
      "email": "alice@student.com",
      "rollNumber": "STU001",
      "class": "10th Grade",
      "section": "A",
      "parentName": "Robert Johnson",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3
  }
}
```

---

### Get Student by ID
**GET** `/api/students/:id`

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "student": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Alice Johnson",
    "email": "alice@student.com",
    "rollNumber": "STU001",
    "class": "10th Grade",
    "section": "A",
    "dateOfBirth": "2008-05-15T00:00:00.000Z",
    "parentName": "Robert Johnson",
    "parentEmail": "robert@parent.com",
    "parentPhone": "555-0101",
    "address": "123 Main St"
  }
}
```

---

### Update Student
**PUT** `/api/students/:id`

**Headers:** Authorization required (admin/teacher)

**Body:** (all fields optional)
```json
{
  "name": "Alice Updated",
  "email": "alice.new@student.com",
  "class": "11th Grade",
  "section": "B"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "student": { /* updated student */ }
}
```

---

### Delete Student
**DELETE** `/api/students/:id`

**Headers:** Authorization required (admin only)

**Response:**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## Marks Endpoints

### Add Mark
**POST** `/api/marks`

**Headers:** Authorization required (admin/teacher)

**Body:**
```json
{
  "student": "65a1b2c3d4e5f6g7h8i9j0k1",
  "subject": "Mathematics",
  "examName": "Mid-term Exam",
  "marks": 85,
  "maxMarks": 100,
  "examDate": "2024-01-20",
  "remarks": "Good performance"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mark added successfully",
  "mark": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "student": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Alice Johnson",
      "rollNumber": "STU001",
      "class": "10th Grade"
    },
    "subject": "Mathematics",
    "examName": "Mid-term Exam",
    "marks": 85,
    "maxMarks": 100,
    "percentage": "85.00",
    "grade": "A",
    "examDate": "2024-01-20T00:00:00.000Z",
    "remarks": "Good performance"
  },
  "aiSuggestion": "📚 **Study Plan Suggestion**\n\n**Performance Assessment:**\nAlice scored an excellent 85% in Mathematics..."
}
```

---

### Get Student Marks
**GET** `/api/marks/student/:id`

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "marks": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "student": "65a1b2c3d4e5f6g7h8i9j0k1",
      "subject": "Mathematics",
      "examName": "Mid-term Exam",
      "marks": 85,
      "maxMarks": 100,
      "percentage": "85.00",
      "grade": "A",
      "examDate": "2024-01-20T00:00:00.000Z",
      "addedBy": {
        "name": "John Teacher",
        "email": "teacher@eduflow.com"
      }
    }
  ],
  "count": 1
}
```

---

### Bulk Add Marks
**POST** `/api/marks/bulk`

**Headers:** Authorization required (admin/teacher)

**Body:**
```json
{
  "marks": [
    {
      "studentId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "subject": "Science",
      "examName": "Unit Test",
      "marks": 92,
      "maxMarks": 100,
      "examDate": "2024-01-22"
    },
    {
      "studentId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "subject": "English",
      "examName": "Unit Test",
      "marks": 78,
      "maxMarks": 100,
      "examDate": "2024-01-22"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk import completed. 2 succeeded, 0 failed.",
  "results": {
    "success": [ /* array of created marks */ ],
    "failed": [ /* array of failed imports with reasons */ ]
  }
}
```

---

### Upload CSV Marks
**POST** `/api/marks/upload`

**Headers:**
- Authorization required (admin/teacher)
- Content-Type: multipart/form-data

**Body:** FormData with file field "file"

**CSV Format:**
```csv
studentId,subject,examName,marks,maxMarks,examDate
65a1b2c3d4e5f6g7h8i9j0k1,Mathematics,Mid-term,85,100,2024-01-20
65a1b2c3d4e5f6g7h8i9j0k1,Science,Mid-term,92,100,2024-01-20
```

**Response:**
```json
{
  "success": true,
  "message": "CSV import completed. 2 succeeded, 0 failed.",
  "results": {
    "success": [ /* created marks */ ],
    "failed": []
  }
}
```

---

## Attendance Endpoints

### Mark Attendance
**POST** `/api/attendance`

**Headers:** Authorization required (admin/teacher)

**Body:**
```json
{
  "student": "65a1b2c3d4e5f6g7h8i9j0k1",
  "date": "2024-01-20",
  "status": "present",
  "subject": "General",
  "remarks": ""
}
```

**Status values:** `present`, `absent`, `late`, `excused`

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "attendance": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
    "student": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Alice Johnson",
      "rollNumber": "STU001",
      "class": "10th Grade"
    },
    "date": "2024-01-20T00:00:00.000Z",
    "status": "present",
    "subject": "General"
  }
}
```

---

### Get Student Attendance
**GET** `/api/attendance/student/:id`

**Headers:** Authorization required

**Query Parameters:**
- `startDate` (optional): Filter from date (YYYY-MM-DD)
- `endDate` (optional): Filter to date (YYYY-MM-DD)
- `subject` (optional): Filter by subject

**Example:** `/api/attendance/student/65a1b2c3d4e5f6g7h8i9j0k1?startDate=2024-01-01&endDate=2024-01-31`

**Response:**
```json
{
  "success": true,
  "attendance": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "student": "65a1b2c3d4e5f6g7h8i9j0k1",
      "date": "2024-01-20T00:00:00.000Z",
      "status": "present",
      "subject": "General",
      "markedBy": {
        "name": "John Teacher",
        "email": "teacher@eduflow.com"
      }
    }
  ],
  "statistics": {
    "total": 30,
    "present": 27,
    "absent": 2,
    "late": 1,
    "excused": 0,
    "attendancePercentage": "90.00"
  }
}
```

---

### Bulk Mark Attendance
**POST** `/api/attendance/bulk`

**Headers:** Authorization required (admin/teacher)

**Body:**
```json
{
  "attendanceData": [
    {
      "studentId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "date": "2024-01-20",
      "status": "present",
      "subject": "General"
    },
    {
      "studentId": "65a1b2c3d4e5f6g7h8i9j0k2",
      "date": "2024-01-20",
      "status": "absent",
      "subject": "General"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk attendance completed. 2 succeeded, 0 failed.",
  "results": {
    "success": [ /* created attendance records */ ],
    "failed": []
  }
}
```

---

## Task Endpoints

### Create Task
**POST** `/api/tasks`

**Headers:** Authorization required

**Body:**
```json
{
  "title": "Complete Math Assignment",
  "description": "Solve problems from chapter 5",
  "priority": "high",
  "category": "study",
  "dueDate": "2024-01-25",
  "tags": ["homework", "math"]
}
```

**Priority values:** `low`, `medium`, `high`, `urgent`
**Category values:** `work`, `study`, `personal`, `project`, `other`

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
    "user": "65a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Complete Math Assignment",
    "description": "Solve problems from chapter 5",
    "priority": "high",
    "category": "study",
    "dueDate": "2024-01-25T00:00:00.000Z",
    "completed": false,
    "tags": ["homework", "math"],
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

---

### Get Tasks
**GET** `/api/tasks`

**Headers:** Authorization required

**Query Parameters:**
- `completed` (optional): Filter by completion (true/false)
- `priority` (optional): Filter by priority
- `category` (optional): Filter by category
- `search` (optional): Search in title and description

**Example:** `/api/tasks?completed=false&priority=high`

**Response:**
```json
{
  "success": true,
  "tasks": [ /* array of task objects */ ],
  "count": 5
}
```

---

### Toggle Task Completion
**PUT** `/api/tasks/:id/toggle`

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "message": "Task marked as completed",
  "task": { /* updated task */ }
}
```

---

### Update Task
**PUT** `/api/tasks/:id`

**Headers:** Authorization required

**Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "completed": true,
  "priority": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": { /* updated task */ }
}
```

---

### Delete Task
**DELETE** `/api/tasks/:id`

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Habit Endpoints

### Create Habit
**POST** `/api/habits`

**Headers:** Authorization required

**Body:**
```json
{
  "name": "Morning Exercise",
  "description": "30 minutes of workout",
  "frequency": "daily",
  "targetDays": 1,
  "color": "#3B82F6"
}
```

**Frequency values:** `daily`, `weekly`, `monthly`

**Response:**
```json
{
  "success": true,
  "message": "Habit created successfully",
  "habit": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
    "user": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Morning Exercise",
    "description": "30 minutes of workout",
    "frequency": "daily",
    "targetDays": 1,
    "currentStreak": 0,
    "longestStreak": 0,
    "totalCompletions": 0,
    "color": "#3B82F6",
    "isActive": true
  }
}
```

---

### Get Habits
**GET** `/api/habits`

**Headers:** Authorization required

**Query Parameters:**
- `isActive` (optional): Filter by active status (true/false)

**Response:**
```json
{
  "success": true,
  "habits": [ /* array of habit objects */ ],
  "count": 3
}
```

---

### Mark Habit Done
**PUT** `/api/habits/:id/done`

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "message": "Habit marked as done! Current streak: 7 days",
  "habit": {
    /* updated habit with incremented streak */
    "currentStreak": 7,
    "longestStreak": 7,
    "totalCompletions": 15,
    "lastCompletedDate": "2024-01-20T00:00:00.000Z"
  }
}
```

---

### Update Habit
**PUT** `/api/habits/:id`

**Headers:** Authorization required

**Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "frequency": "weekly",
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Habit updated successfully",
  "habit": { /* updated habit */ }
}
```

---

### Delete Habit
**DELETE** `/api/habits/:id`

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "message": "Habit deleted successfully"
}
```

---

## AI Endpoints

### Generate Study Plan
**POST** `/api/ai/study-plan`

**Headers:** Authorization required

**Body:**
```json
{
  "studentName": "Alice Johnson",
  "subject": "Mathematics",
  "marks": 75,
  "maxMarks": 100
}
```

**Response:**
```json
{
  "success": true,
  "studyPlan": "📚 **Study Plan Suggestion**\n\n**Performance Assessment:**\nAlice scored 75% in Mathematics, which shows a good understanding...\n\n**Recommended Action Steps:**\n1. Review fundamentals...\n2. Practice regularly...",
  "metadata": {
    "studentName": "Alice Johnson",
    "subject": "Mathematics",
    "marks": 75,
    "maxMarks": 100,
    "percentage": "75.00"
  }
}
```

---

### Prioritize Tasks
**POST** `/api/ai/prioritize`

**Headers:** Authorization required

**Body:**
```json
{
  "tasks": [
    {
      "title": "Math homework",
      "priority": "high",
      "dueDate": "2024-01-25",
      "category": "study"
    },
    {
      "title": "Read book",
      "priority": "low",
      "dueDate": null,
      "category": "personal"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "advice": "✅ **Task Prioritization Advice**\n\n**Today's Focus:**\n1. Math homework (High priority, due soon)...",
  "prioritizedTasks": [
    { /* top 3 tasks in priority order */ }
  ]
}
```

---

### Get Habit Tip
**POST** `/api/ai/habit-tip`

**Headers:** Authorization required

**Body (Option 1 - Direct data):**
```json
{
  "habitData": {
    "name": "Morning Exercise",
    "currentStreak": 7,
    "longestStreak": 12,
    "frequency": "daily",
    "totalCompletions": 25
  }
}
```

**Body (Option 2 - By ID):**
```json
{
  "habitId": "65a1b2c3d4e5f6g7h8i9j0k5"
}
```

**Response:**
```json
{
  "success": true,
  "advice": "🌟 **Habit Building Advice**\n\n**Great Progress!**\nYou're on a 7-day streak with Morning Exercise...",
  "habitData": { /* habit info */ }
}
```

---

### Ask AI
**POST** `/api/ai/ask`

**Headers:** Authorization required

**Body:**
```json
{
  "question": "How can I improve my study habits?"
}
```

**Response:**
```json
{
  "success": true,
  "question": "How can I improve my study habits?",
  "response": "Here are some evidence-based strategies to improve your study habits:\n\n1. Active recall..."
}
```

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description here",
  "error": "Detailed error message (development only)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production:
- Recommended: 100 requests per 15 minutes per IP
- Auth endpoints: 5 login attempts per 15 minutes

---

## Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eduflow.com","password":"admin123"}'
```

### Get Students (with token)
```bash
curl http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","priority":"high","category":"study"}'
```

---

## Postman Collection

Import this JSON to Postman for quick testing:

```json
{
  "info": {
    "name": "EduFlow Suite API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}"
      }
    ]
  }
}
```

---

**Last Updated:** January 2025
**API Version:** 1.0.0
