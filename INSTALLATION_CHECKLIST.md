# EduFlow Suite - Installation Checklist

Use this checklist to ensure everything is set up correctly.

## 📋 Pre-Installation

- [ ] Node.js v18+ installed (`node --version`)
- [ ] MongoDB installed and running (`mongod --version`)
- [ ] Git installed (optional, `git --version`)
- [ ] Code editor installed (VS Code recommended)

## 🔧 Backend Setup

- [ ] Navigate to backend folder: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] `.env` file created and configured
- [ ] MongoDB connection string correct in `.env`
- [ ] JWT_SECRET set in `.env`
- [ ] (Optional) Claude API key added to `.env`

### Verify Backend Dependencies

Run `npm list --depth=0` and check for:
- [ ] express
- [ ] mongoose
- [ ] jsonwebtoken
- [ ] bcryptjs
- [ ] cors
- [ ] multer
- [ ] axios
- [ ] nodemailer
- [ ] csv-parser
- [ ] nodemon (devDependency)

## 💻 Frontend Setup

- [ ] Navigate to frontend folder: `cd frontend`
- [ ] Install dependencies: `npm install`
- [ ] `.env` file created with VITE_API_URL
- [ ] API URL points to backend (default: http://localhost:5000/api)

### Verify Frontend Dependencies

Run `npm list --depth=0` and check for:
- [ ] react
- [ ] react-dom
- [ ] react-router-dom
- [ ] axios
- [ ] chart.js
- [ ] react-chartjs-2
- [ ] react-icons
- [ ] vite
- [ ] tailwindcss

## 🗄️ Database Setup

- [ ] MongoDB service is running
  - Windows: `net start MongoDB`
  - Mac: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`
- [ ] Can connect to MongoDB (test with MongoDB Compass or CLI)
- [ ] Database seed script executed: `cd backend && npm run seed`

## 🚀 Running the Application

### Backend Server
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Backend running on port 5000 (or your configured port)
- [ ] Console shows: "✅ MongoDB connected successfully"
- [ ] Console shows: "🚀 Server running on http://localhost:5000"
- [ ] No error messages in console

### Frontend Server
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Frontend running on port 5173 (or your configured port)
- [ ] Console shows local and network URLs
- [ ] Browser automatically opens to http://localhost:5173

## 🧪 Basic Testing

### Test Login
- [ ] Open http://localhost:5173 in browser
- [ ] Login page loads correctly
- [ ] Demo credentials shown on page
- [ ] Can login with: admin@eduflow.com / admin123
- [ ] Redirects to dashboard after login
- [ ] No console errors in browser DevTools

### Test Dashboard
- [ ] Dashboard displays after login
- [ ] User name shown in header
- [ ] Sidebar navigation visible
- [ ] Statistics cards display
- [ ] No loading spinner stuck

### Test Students (Admin/Teacher)
- [ ] Navigate to Students page
- [ ] List of students displays
- [ ] Search functionality works
- [ ] Class filter works
- [ ] Click on student opens profile
- [ ] Student profile shows charts

### Test Student Profile
- [ ] Student information displays
- [ ] Marks chart renders (Chart.js)
- [ ] Attendance chart renders
- [ ] Recent marks table shows data
- [ ] "Get AI Suggestion" button present

### Test Tasks
- [ ] Navigate to Tasks page
- [ ] Can create new task
- [ ] Task appears in list
- [ ] Can toggle task completion
- [ ] Filter tabs work (all/active/completed)
- [ ] "AI Prioritize" button present

### Test Habits
- [ ] Navigate to Habits page
- [ ] Can create new habit
- [ ] Habit card displays with streak
- [ ] Can mark habit as done
- [ ] Streak increments correctly
- [ ] "Get Habit Tip" button present

### Test AI Features (If Claude API Configured)
- [ ] Add marks for student → AI suggestion appears
- [ ] Click "Get AI Suggestion" on student profile → Response received
- [ ] Click "AI Prioritize" on Tasks → Advice displayed
- [ ] Click "Get Habit Tip" on Habits → Tip received

### Test Without Claude API
- [ ] All AI buttons still work
- [ ] Fallback responses display
- [ ] No errors or crashes
- [ ] App remains fully functional

## 🔍 Common Issues Checklist

### Backend Issues
- [ ] Check MongoDB is running: `mongo --eval "db.version()"`
- [ ] Verify .env file exists and has correct values
- [ ] Check no other process using port 5000: `netstat -ano | findstr :5000`
- [ ] Review backend console for error messages
- [ ] Ensure all dependencies installed: `npm install`

### Frontend Issues
- [ ] Check backend is running first
- [ ] Verify .env has correct VITE_API_URL
- [ ] Clear browser cache and cookies
- [ ] Check browser console for errors (F12)
- [ ] Ensure all dependencies installed: `npm install`
- [ ] Try different browser

### Database Issues
- [ ] MongoDB service status: `sc query MongoDB` (Windows)
- [ ] Connection string format correct in .env
- [ ] Database user has correct permissions
- [ ] Firewall not blocking MongoDB port 27017

### CORS Issues
- [ ] Backend .env has correct FRONTEND_URL
- [ ] Both servers running on correct ports
- [ ] Check CORS configuration in backend/server.js

## 📱 Browser Compatibility Test

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile responsive view (F12 → Device Toolbar)

## 🎨 UI/UX Verification

- [ ] Tailwind CSS styles loading
- [ ] Icons displaying (React Icons)
- [ ] Charts rendering (Chart.js)
- [ ] Responsive design working
- [ ] Mobile menu toggle works
- [ ] Forms validate correctly
- [ ] Buttons have hover effects
- [ ] Loading spinners display when needed

## 🔐 Security Verification

- [ ] Passwords not visible in responses
- [ ] JWT token stored in localStorage
- [ ] Protected routes redirect to login
- [ ] Role-based access working
- [ ] Logout clears token
- [ ] Can't access admin panel as student

## 📊 Data Verification

After seed script:
- [ ] 1 Admin user created
- [ ] 1 Teacher user created
- [ ] 5 Student users created
- [ ] Students have marks
- [ ] Students have attendance records
- [ ] Can login with any seeded user

## 🎯 Final Checks

- [ ] No console errors (backend)
- [ ] No console errors (frontend browser)
- [ ] All pages accessible
- [ ] All buttons functional
- [ ] All forms submitting
- [ ] Charts displaying data
- [ ] AI buttons working (or fallbacks)
- [ ] Logout works correctly
- [ ] Can re-login after logout

## 📝 Optional Features

- [ ] Claude API configured and working
- [ ] Email notifications configured
- [ ] FCM push notifications configured
- [ ] Razorpay payment configured
- [ ] CSV upload tested

## ✅ Production Ready Checklist

- [ ] Strong JWT_SECRET set
- [ ] MongoDB using authentication
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Error logging configured
- [ ] Backup strategy in place
- [ ] Rate limiting added
- [ ] Input sanitization verified

## 🆘 If Something's Not Working

1. **Check all previous items in this checklist**
2. **Review terminal logs** for error messages
3. **Check browser console** (F12) for frontend errors
4. **Verify .env files** have correct configuration
5. **Restart both servers** after .env changes
6. **Clear browser cache** and localStorage
7. **Re-run seed script** if database seems empty
8. **Read README.md** troubleshooting section
9. **Check QUICKSTART.md** for quick fixes

## 📞 Getting Help

If still stuck:
1. Review error messages carefully
2. Check MongoDB logs
3. Verify all dependencies installed
4. Ensure correct Node.js version
5. Try on different machine/browser
6. Check firewall/antivirus settings

## 🎉 Success!

If all items checked, you have successfully installed EduFlow Suite!

**Next Steps:**
1. Explore all features
2. Add your own data
3. Configure Claude API for real AI
4. Customize Tailwind theme
5. Deploy to production

---

**Happy Learning and Organizing!** 📚✅🚀
