// frontend/src/utils/api.js
import axios from 'axios';

// Use relative URL to leverage Vite proxy
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Students API
export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`)
};

// Marks API
export const marksAPI = {
  getAll: (params) => api.get('/marks', { params }),
  getStudentMarks: (studentId) => api.get(`/marks/student/${studentId}`),
  add: (data) => api.post('/marks', data),
  bulkAdd: (marks) => api.post('/marks/bulk', { marks }),
  uploadCSV: (formData) => api.post('/marks/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/marks/${id}`, data),
  delete: (id) => api.delete(`/marks/${id}`)
};

// Attendance API
export const attendanceAPI = {
  getStudentAttendance: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params }),
  mark: (data) => api.post('/attendance', data),
  bulkMark: (attendanceData) => api.post('/attendance/bulk', { attendanceData }),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`)
};

// Tasks API
export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  toggle: (id) => api.put(`/tasks/${id}/toggle`),
  delete: (id) => api.delete(`/tasks/${id}`)
};

// Habits API
export const habitsAPI = {
  getAll: (params) => api.get('/habits', { params }),
  getById: (id) => api.get(`/habits/${id}`),
  create: (data) => api.post('/habits', data),
  update: (id, data) => api.put(`/habits/${id}`, data),
  markDone: (id) => api.put(`/habits/${id}/done`),
  delete: (id) => api.delete(`/habits/${id}`)
};

// AI API
export const aiAPI = {
  getStudyPlan: (data) => api.post('/ai/study-plan', data),
  prioritizeTasks: (tasks) => api.post('/ai/prioritize', { tasks }),
  getHabitTip: (habitData) => api.post('/ai/habit-tip', habitData),
  ask: (question) => api.post('/ai/ask', { question })
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getStudent: (id) => api.get(`/analytics/student/${id}`),
  getClass: (className) => api.get(`/analytics/class/${className}`),
  getTasks: () => api.get('/analytics/tasks'),
  getHabits: () => api.get('/analytics/habits')
};

export default api;
