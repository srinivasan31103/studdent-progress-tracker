// backend/scripts/seedUsers.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Admin password from environment variable for security
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    // Demo users with valid passwords (8+ chars, uppercase, lowercase, number)
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@eduflow.com',
        password: adminPassword,
        role: 'admin',
        isActive: true
      },
      {
        name: 'Teacher User',
        email: 'teacher@eduflow.com',
        password: 'Teacher@123',
        role: 'teacher',
        isActive: true
      },
      {
        name: 'Student User',
        email: 'student@eduflow.com',
        password: 'Student@123',
        role: 'student',
        isActive: true
      }
    ];

    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        // Update password if user exists
        existingUser.password = userData.password;
        await existingUser.save();
        console.log(`Updated user: ${userData.email}`);
      } else {
        await User.create(userData);
        console.log(`Created user: ${userData.email}`);
      }
    }

    console.log('\n✅ Seed completed!');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedUsers();
