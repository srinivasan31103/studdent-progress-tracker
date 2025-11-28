// frontend/src/components/Layout.jsx
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome, FaUsers, FaTasks, FaCalendarCheck, FaUserShield, FaSignOutAlt, FaBars, FaTimes, FaClipboardList, FaUserCheck
} from 'react-icons/fa';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome, roles: ['admin', 'teacher', 'student', 'parent'] },
    { path: '/students', label: 'Students', icon: FaUsers, roles: ['admin', 'teacher'] },
    { path: '/marks', label: 'Marks', icon: FaClipboardList, roles: ['admin', 'teacher'] },
    { path: '/attendance', label: 'Attendance', icon: FaUserCheck, roles: ['admin', 'teacher'] },
    { path: '/tasks', label: 'Tasks', icon: FaTasks, roles: ['admin', 'teacher', 'student', 'parent'] },
    { path: '/habits', label: 'Habits', icon: FaCalendarCheck, roles: ['admin', 'teacher', 'student', 'parent'] },
    { path: '/admin', label: 'Admin Panel', icon: FaUserShield, roles: ['admin'] }
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 z-30 w-64 bg-white shadow-lg h-full transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-primary-600">EduFlow Suite</h1>
            <p className="text-sm text-gray-500 mt-1">{user?.role?.toUpperCase()}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`sidebar-link ${
                        isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            <h2 className="text-xl font-semibold text-gray-800">
              {filteredNavItems.find(item => item.path === location.pathname)?.label || 'EduFlow Suite'}
            </h2>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
