# EduFlow Suite - Student Progress Tracker & Task/Habit Manager

A comprehensive full-stack MERN application that combines student progress tracking with personal task and habit management, powered by Claude AI for intelligent insights and recommendations.

## Features

### Student Progress Tracker (SmartClass)
- 📊 **Student Management** - Create, view, edit, and manage student profiles
- 📝 **Marks Management** - Add marks, generate AI-powered study plans
- 📅 **Attendance Tracking** - Mark and monitor student attendance with statistics
- 📈 **Performance Charts** - Visualize student performance with Chart.js
- 🤖 **AI Study Plans** - Claude AI generates personalized study recommendations
- 📤 **Bulk Upload** - CSV import for bulk marks entry

### Task & Habit Tracker (FocusFlow)
- ✅ **Task Management** - Create, organize, and track tasks with priorities
- 🎯 **AI Prioritization** - Claude AI suggests daily top tasks
- 🔥 **Habit Tracking** - Build and maintain streaks for positive habits
- 💡 **AI Habit Tips** - Get personalized habit-building advice
- 📊 **Progress Dashboard** - Visual overview of tasks and habits

### Authentication & Authorization
- 🔐 JWT-based authentication
- 👥 Role-based access control (Admin, Teacher, Student, Parent)
- 🔒 Secure password hashing with bcrypt

## Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **File Upload**: Multer for CSV/image uploads
- **AI Integration**: Claude API (Anthropic)
- **Email**: Nodemailer (Gmail/SMTP support)
- **Module System**: ES Modules (import/export)

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: React Icons
- **HTTP Client**: Axios

## Prerequisites

- Node.js v18+
- MongoDB v6+
- Claude API key (optional - fallback responses provided)
- Gmail app password (optional - for email notifications)

## Installation & Setup

### 1. Clone or Extract the Project

```bash
cd "E:\Sri\Student Progress Tracker"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend folder:

```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/eduflow-suite

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Claude AI API (optional)
CLAUDE_API_KEY=sk-ant-api03-your-claude-api-key-here

# Email Configuration (optional)
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-specific-password

# Optional
FCM_SERVER_KEY=your-fcm-server-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file in frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_DEV_MODE=true
```

### 4. Start MongoDB

Ensure MongoDB is running:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 5. Seed the Database (Optional but Recommended)

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@eduflow.com` / `admin123`
- Teacher user: `teacher@eduflow.com` / `teacher123`
- 5 sample students with credentials like: `alice@student.com` / `student123`
- Sample marks and attendance data

### 6. Run the Application

#### Option A: Run servers separately

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

#### Option B: Use concurrently (install first)

```bash
npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

### 7. Access the Application

Open your browser to: **http://localhost:5173**

## Default Login Credentials

After running the seed script:

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | admin@eduflow.com      | admin123   |
| Teacher | teacher@eduflow.com    | teacher123 |
| Student | alice@student.com      | student123 |
| Student | bob@student.com        | student123 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Students
- `POST /api/students` - Create student (admin/teacher)
- `GET /api/students` - List students (admin/teacher)
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student (admin/teacher)
- `DELETE /api/students/:id` - Delete student (admin)

### Marks
- `POST /api/marks` - Add mark (teacher/admin)
- `GET /api/marks/student/:id` - Get student marks
- `POST /api/marks/bulk` - Bulk add marks
- `POST /api/marks/upload` - Upload CSV
- `PUT /api/marks/:id` - Update mark (teacher/admin)
- `DELETE /api/marks/:id` - Delete mark (admin)

### Attendance
- `POST /api/attendance` - Mark attendance (teacher/admin)
- `GET /api/attendance/student/:id` - Get student attendance
- `POST /api/attendance/bulk` - Bulk mark attendance
- `PUT /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get user tasks
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/:id/toggle` - Toggle completion
- `DELETE /api/tasks/:id` - Delete task

### Habits
- `POST /api/habits` - Create habit
- `GET /api/habits` - Get user habits
- `GET /api/habits/:id` - Get single habit
- `PUT /api/habits/:id` - Update habit
- `PUT /api/habits/:id/done` - Mark habit done (updates streak)
- `DELETE /api/habits/:id` - Delete habit

### AI Endpoints
- `POST /api/ai/study-plan` - Generate study plan
  ```json
  {
    "studentName": "Alice",
    "subject": "Mathematics",
    "marks": 75,
    "maxMarks": 100
  }
  ```
- `POST /api/ai/prioritize` - Prioritize tasks
  ```json
  {
    "tasks": [/* array of task objects */]
  }
  ```
- `POST /api/ai/habit-tip` - Get habit advice
  ```json
  {
    "habitData": {
      "name": "Reading",
      "currentStreak": 7,
      "frequency": "daily"
    }
  }
  ```
- `POST /api/ai/ask` - General AI query
  ```json
  {
    "question": "How can I improve my study habits?"
  }
  ```

## Claude AI Integration

### Setting Up Claude API

1. Get API key from [Anthropic Console](https://console.anthropic.com/)
2. Add to backend `.env`:
   ```env
   CLAUDE_API_KEY=sk-ant-api03-xxxxxxxxxxxxx
   ```

### AI Features

The application uses Claude AI for:

1. **Study Plans**: After adding marks, AI generates personalized study recommendations
2. **Task Prioritization**: Analyzes tasks and suggests top 3 priorities
3. **Habit Advice**: Provides motivation and tips based on current streaks

### Fallback Behavior

If Claude API is not configured, the system provides default helpful responses, so the app remains fully functional.

## CSV Upload Format

For bulk marks upload, use this CSV format:

```csv
studentId,subject,examName,marks,maxMarks,examDate
65a1b2c3d4e5f6g7h8i9j0k1,Mathematics,Mid-term Exam,85,100,2024-01-15
65a1b2c3d4e5f6g7h8i9j0k1,Science,Unit Test 1,92,100,2024-01-20
```

## Email Notifications Setup

### Gmail Configuration

1. Enable 2-Factor Authentication on your Google account
2. Generate App Password: Google Account → Security → App passwords
3. Add to `.env`:
   ```env
   MAIL_USER=your-email@gmail.com
   MAIL_PASS=your-16-digit-app-password
   ```

## Project Structure

```
EduFlow Suite/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth, upload, etc.
│   ├── utils/            # Claude client, helpers
│   ├── uploads/          # File upload directory
│   ├── server.js         # Express app
│   ├── seed.js           # Database seeder
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context (Auth)
│   │   ├── utils/        # API client, helpers
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Tailwind styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
│
└── README.md
```

## Development Tips

### Backend Development

- Use `npm run dev` for auto-restart with nodemon
- Check `backend/uploads/` for uploaded files
- MongoDB connection logs appear in console
- API errors return JSON with `success: false`

### Frontend Development

- Hot reload enabled via Vite
- API calls automatically add JWT token
- Protected routes redirect to `/login`
- Tailwind classes are purged in production

### Testing AI Features

1. Login as teacher or admin
2. Add marks for a student
3. View student profile → Click "Get AI Suggestion"
4. Go to Tasks → Add tasks → Click "AI Prioritize"
5. Go to Habits → Create habit → Click "Get Habit Tip"

## Common Issues & Solutions

### MongoDB Connection Error

```bash
# Ensure MongoDB is running
# Windows: net start MongoDB
# Mac/Linux: sudo systemctl start mongod
```

### CORS Errors

- Ensure backend `.env` has correct `FRONTEND_URL`
- Check Vite proxy config in `vite.config.js`

### JWT Token Expired

- Tokens expire after 30 days
- User is auto-logged out and redirected to login

### Claude API Errors

- Check API key is valid
- Verify API quota/credits
- App works with fallback responses if API unavailable

### Port Already in Use

```bash
# Change ports in .env files
# Backend: PORT=5001
# Frontend: Update vite.config.js server.port
```

## Production Deployment

### Environment Variables

Update for production:
```env
NODE_ENV=production
JWT_SECRET=use-very-strong-random-secret
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eduflow
FRONTEND_URL=https://your-domain.com
```

### Build Frontend

```bash
cd frontend
npm run build
# Serves from backend or deploy dist/ to CDN
```

### Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong MongoDB credentials
- [ ] Enable MongoDB authentication
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Rate limit API endpoints
- [ ] Validate all user inputs
- [ ] Keep dependencies updated

## Optional Features

### Razorpay Integration (Paid Features)

```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

### FCM Push Notifications

```env
FCM_SERVER_KEY=your-fcm-server-key
```

## Troubleshooting

### Reset Database

```bash
# Drop database and re-seed
cd backend
node seed.js
```

### Clear Browser Cache

- Ctrl+Shift+Delete (Windows/Linux)
- Cmd+Shift+Delete (Mac)

### Check Logs

- Backend: Terminal running `npm run dev`
- Frontend: Browser DevTools Console
- MongoDB: Check `mongod` logs

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues, questions, or contributions:
- Check documentation above
- Review code comments
- Test with demo credentials
- Verify environment variables

## Credits

- **AI**: Claude by Anthropic
- **Charts**: Chart.js
- **Icons**: React Icons
- **CSS**: Tailwind CSS
- **Backend**: Express.js & MongoDB

---

**Built with Claude Code** 🤖

Last Updated: January 2025
