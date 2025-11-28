// backend/utils/emailService.js
import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn('⚠️  Email credentials not configured. Email notifications disabled.');
    return null;
  }

  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
};

// Email Templates
const templates = {
  marksAdded: (studentName, subject, marks, maxMarks, examName) => ({
    subject: `📊 New Marks Added - ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .marks-card { background: linear-gradient(135deg, #f0f4ff 0%, #e9e4ff 100%); padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
            .marks-value { font-size: 48px; font-weight: bold; color: #667eea; margin: 10px 0; }
            .percentage { font-size: 24px; color: #764ba2; }
            .footer { background: #f7f7f7; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; }
            .btn { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 EduFlow Suite</h1>
              <p>New Marks Notification</p>
            </div>
            <div class="content">
              <h2>Hi ${studentName},</h2>
              <p>Your marks for <strong>${examName}</strong> in <strong>${subject}</strong> have been added to the system.</p>

              <div class="marks-card">
                <div class="marks-value">${marks}/${maxMarks}</div>
                <div class="percentage">${((marks / maxMarks) * 100).toFixed(2)}%</div>
                <p style="margin-top: 10px; color: #666;">Keep up the great work!</p>
              </div>

              <p>Log in to view detailed analysis and AI-powered study suggestions.</p>

              <a href="${process.env.FRONTEND_URL}/login" class="btn">View Dashboard</a>
            </div>
            <div class="footer">
              <p>This is an automated email from EduFlow Suite</p>
              <p>© ${new Date().getFullYear()} EduFlow Suite. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  attendanceAlert: (studentName, status, date, parentName) => ({
    subject: `📅 Attendance Alert - ${status.toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, ${status === 'present' ? '#10b981, #047857' : '#ef4444, #b91c1c'}); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .status-badge { display: inline-block; padding: 10px 20px; background: ${status === 'present' ? '#10b981' : status === 'absent' ? '#ef4444' : '#f59e0b'}; color: white; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
            .footer { background: #f7f7f7; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Attendance Notification</h1>
            </div>
            <div class="content">
              <h2>Dear ${parentName || 'Parent/Guardian'},</h2>
              <p>This is to inform you about ${studentName}'s attendance status for ${new Date(date).toLocaleDateString()}.</p>

              <p style="text-align: center; margin: 30px 0;">
                <span class="status-badge">${status}</span>
              </p>

              <p>${status === 'absent' ? 'Please ensure regular attendance for better academic performance.' : 'Thank you for ensuring regular attendance.'}</p>

              <p>For more details, please log in to the parent portal.</p>
            </div>
            <div class="footer">
              <p>This is an automated email from EduFlow Suite</p>
              <p>© ${new Date().getFullYear()} EduFlow Suite. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  welcomeEmail: (userName, userEmail, userRole) => ({
    subject: '🎉 Welcome to EduFlow Suite!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .feature-box { background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
            .btn { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .footer { background: #f7f7f7; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to EduFlow Suite!</h1>
              <p>Your journey to educational excellence starts here</p>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>Welcome to EduFlow Suite! We're excited to have you join our platform as a <strong>${userRole}</strong>.</p>

              <div class="feature-box">
                <h3>📊 Track Progress</h3>
                <p>Monitor academic performance with detailed marks and attendance tracking.</p>
              </div>

              <div class="feature-box">
                <h3>✅ Manage Tasks</h3>
                <p>Organize your study schedule with our intelligent task manager.</p>
              </div>

              <div class="feature-box">
                <h3>🎯 Build Habits</h3>
                <p>Develop positive study habits with our streak tracking system.</p>
              </div>

              <div class="feature-box">
                <h3>🤖 AI-Powered Insights</h3>
                <p>Get personalized study plans and recommendations powered by Claude AI.</p>
              </div>

              <p><strong>Your Login Credentials:</strong></p>
              <p>Email: ${userEmail}</p>
              <p>Password: (As set during registration)</p>

              <a href="${process.env.FRONTEND_URL}/login" class="btn">Go to Dashboard</a>

              <p style="margin-top: 30px;">Need help? Check out our <a href="#">Getting Started Guide</a> or contact support.</p>
            </div>
            <div class="footer">
              <p>This is an automated email from EduFlow Suite</p>
              <p>© ${new Date().getFullYear()} EduFlow Suite. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  taskReminder: (userName, tasks) => ({
    subject: '⏰ Task Reminder - Upcoming Deadlines',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .task-item { background: #fffbeb; padding: 15px; border-left: 4px solid #f59e0b; margin: 10px 0; border-radius: 5px; }
            .priority-high { border-left-color: #ef4444; background: #fee2e2; }
            .priority-urgent { border-left-color: #dc2626; background: #fecaca; }
            .footer { background: #f7f7f7; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Task Reminder</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>You have ${tasks.length} pending task(s) with upcoming deadlines:</p>

              ${tasks.map(task => `
                <div class="task-item ${task.priority === 'high' || task.priority === 'urgent' ? 'priority-' + task.priority : ''}">
                  <h3>${task.title}</h3>
                  <p><strong>Priority:</strong> ${task.priority.toUpperCase()}</p>
                  <p><strong>Due:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}</p>
                </div>
              `).join('')}

              <p>Stay organized and complete your tasks on time!</p>
            </div>
            <div class="footer">
              <p>This is an automated email from EduFlow Suite</p>
              <p>© ${new Date().getFullYear()} EduFlow Suite. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
};

// Send email function
export const sendEmail = async (to, templateName, templateData) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('📧 Email skipped (not configured):', templateName);
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const template = templates[templateName];
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    const emailContent = template(...Object.values(templateData));

    const mailOptions = {
      from: `"EduFlow Suite" <${process.env.MAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Bulk email function
export const sendBulkEmails = async (recipients, templateName, templateData) => {
  const results = [];

  for (const recipient of recipients) {
    const result = await sendEmail(recipient, templateName, templateData);
    results.push({ recipient, ...result });
  }

  return results;
};

export default {
  sendEmail,
  sendBulkEmails,
  templates
};
