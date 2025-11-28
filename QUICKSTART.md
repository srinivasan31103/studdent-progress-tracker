# EduFlow Suite - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (open new terminal)
cd frontend
npm install
```

### Step 2: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 3: Seed Demo Data

```bash
cd backend
npm run seed
```

This creates demo users and sample data.

### Step 4: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### Step 5: Login & Explore

Open http://localhost:5173 in your browser

**Demo Credentials:**
- **Admin**: admin@eduflow.com / admin123
- **Teacher**: teacher@eduflow.com / teacher123
- **Student**: alice@student.com / student123

## 🎯 What to Try First

### As Admin/Teacher:
1. **Dashboard** - View overview stats
2. **Students** - Browse student list
3. **Student Profile** - Click any student → View marks & charts → Get AI Study Plan
4. **Tasks** - Create tasks → Click "AI Prioritize"
5. **Habits** - Create a habit → Mark it done → Get AI Tips

### As Student:
1. **Dashboard** - See your performance charts
2. **Tasks** - Organize your study tasks
3. **Habits** - Build good study habits with streak tracking
4. **View Profile** - See your marks and attendance

## 🤖 Testing Claude AI Features

The app works WITHOUT Claude API (uses fallback responses), but for real AI:

1. Get API key from: https://console.anthropic.com/
2. Edit `backend/.env`:
   ```env
   CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
   ```
3. Restart backend server
4. Test these features:
   - Add marks for student → Click "Get AI Suggestion"
   - Go to Tasks → Click "AI Prioritize"
   - Go to Habits → Click "Get Habit Tip"

## 📝 API Testing (Optional)

Use Postman or curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eduflow.com","password":"admin123"}'

# Get students (use token from login)
curl http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Troubleshooting

**MongoDB not connecting?**
- Check if MongoDB service is running
- Verify connection string in `backend/.env`

**Port already in use?**
- Change PORT in `backend/.env`
- Change port in `frontend/vite.config.js`

**Login not working?**
- Run seed script again: `cd backend && npm run seed`
- Check browser console for errors
- Clear browser cache

**Charts not showing?**
- Ensure Chart.js is installed: `cd frontend && npm install chart.js react-chartjs-2`
- Check browser console for errors

## 📦 Project Structure Overview

```
backend/
├── models/          # Database schemas
├── controllers/     # Business logic
├── routes/          # API endpoints
├── utils/           # Claude AI client
└── server.js        # Main entry point

frontend/
├── src/
│   ├── pages/       # Main pages (Dashboard, Tasks, etc.)
│   ├── components/  # Reusable components (Layout, etc.)
│   ├── context/     # Auth context
│   └── utils/       # API client
└── index.html
```

## 🎨 Key Technologies

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Vite + Tailwind CSS
- **Charts**: Chart.js
- **AI**: Claude API (Anthropic)
- **Auth**: JWT + bcrypt

## 📚 Next Steps

1. Read full [README.md](README.md) for detailed documentation
2. Explore API endpoints and test with Postman
3. Customize Tailwind theme in `frontend/tailwind.config.js`
4. Add your own students and marks
5. Configure email notifications (optional)
6. Set up Claude API for real AI features

## 💡 Tips

- Use browser DevTools to debug frontend issues
- Check terminal logs for backend errors
- MongoDB compass is great for viewing database
- Postman/Insomnia for API testing
- VS Code recommended for development

## 🆘 Need Help?

1. Check logs in both terminals
2. Review README.md troubleshooting section
3. Ensure all dependencies installed
4. Verify MongoDB is running
5. Check .env files are configured

---

Happy coding! 🚀
