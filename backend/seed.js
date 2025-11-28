// backend/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Student from './models/Student.js';
import Mark from './models/Mark.js';
import Attendance from './models/Attendance.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eduflow-suite');
    console.log('✅ MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Mark.deleteMany({});
    await Attendance.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eduflow.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Admin created:', admin.email);

    // Create Teacher User
    const teacher = await User.create({
      name: 'John Teacher',
      email: 'teacher@eduflow.com',
      password: 'teacher123',
      role: 'teacher'
    });
    console.log('✅ Teacher created:', teacher.email);

    // Create Sample Students
    const students = [];

    const studentData = [
      {
        name: 'Alice Johnson',
        email: 'alice@student.com',
        rollNumber: 'STU001',
        class: '10th Grade',
        section: 'A',
        parentName: 'Robert Johnson',
        parentEmail: 'robert@parent.com',
        parentPhone: '555-0101'
      },
      {
        name: 'Bob Smith',
        email: 'bob@student.com',
        rollNumber: 'STU002',
        class: '10th Grade',
        section: 'A',
        parentName: 'Mary Smith',
        parentEmail: 'mary@parent.com',
        parentPhone: '555-0102'
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@student.com',
        rollNumber: 'STU003',
        class: '10th Grade',
        section: 'B',
        parentName: 'David Brown',
        parentEmail: 'david@parent.com',
        parentPhone: '555-0103'
      },
      {
        name: 'Diana Prince',
        email: 'diana@student.com',
        rollNumber: 'STU004',
        class: '9th Grade',
        section: 'A',
        parentName: 'Steve Prince',
        parentEmail: 'steve@parent.com',
        parentPhone: '555-0104'
      },
      {
        name: 'Ethan Hunt',
        email: 'ethan@student.com',
        rollNumber: 'STU005',
        class: '9th Grade',
        section: 'B',
        parentName: 'James Hunt',
        parentEmail: 'james@parent.com',
        parentPhone: '555-0105'
      }
    ];

    for (const data of studentData) {
      const student = await Student.create(data);
      students.push(student);

      // Create student user account
      await User.create({
        name: data.name,
        email: data.email,
        password: 'student123',
        role: 'student',
        studentId: student._id
      });
    }
    console.log(`✅ Created ${students.length} students`);

    // Create Sample Marks
    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];
    const exams = ['Mid-term Exam', 'Unit Test 1', 'Unit Test 2', 'Final Exam'];

    let marksCount = 0;
    for (const student of students) {
      for (let i = 0; i < 3; i++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const exam = exams[Math.floor(Math.random() * exams.length)];
        const maxMarks = 100;
        const marks = Math.floor(Math.random() * 40) + 60; // 60-100 range

        await Mark.create({
          student: student._id,
          subject,
          examName: exam,
          marks,
          maxMarks,
          examDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 90 days
          addedBy: teacher._id
        });
        marksCount++;
      }
    }
    console.log(`✅ Created ${marksCount} marks`);

    // Create Sample Attendance
    let attendanceCount = 0;
    const statuses = ['present', 'present', 'present', 'present', 'absent', 'late'];

    for (const student of students) {
      // Create attendance for last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const status = statuses[Math.floor(Math.random() * statuses.length)];

        try {
          await Attendance.create({
            student: student._id,
            date,
            status,
            subject: 'General',
            markedBy: teacher._id
          });
          attendanceCount++;
        } catch (error) {
          // Skip duplicates
        }
      }
    }
    console.log(`✅ Created ${attendanceCount} attendance records`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📝 Login Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Admin:');
    console.log('  Email: admin@eduflow.com');
    console.log('  Password: admin123\n');
    console.log('Teacher:');
    console.log('  Email: teacher@eduflow.com');
    console.log('  Password: teacher123\n');
    console.log('Student (example):');
    console.log('  Email: alice@student.com');
    console.log('  Password: student123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
