// frontend/src/pages/AdminPanel.jsx
import { useState } from 'react';
import { FaUserPlus, FaFileUpload, FaDatabase, FaCog } from 'react-icons/fa';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-purple-500 to-purple-700 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Panel</h1>
        <p className="text-purple-100">Manage system settings and configurations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['overview', 'users', 'bulk-upload', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-blue-50 border border-blue-200">
              <FaUserPlus className="text-3xl text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">User Management</h3>
              <p className="text-sm text-gray-600">Add and manage system users</p>
            </div>
            <div className="card bg-green-50 border border-green-200">
              <FaFileUpload className="text-3xl text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Bulk Upload</h3>
              <p className="text-sm text-gray-600">Import data via CSV</p>
            </div>
            <div className="card bg-purple-50 border border-purple-200">
              <FaDatabase className="text-3xl text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Database</h3>
              <p className="text-sm text-gray-600">Manage database operations</p>
            </div>
            <div className="card bg-orange-50 border border-orange-200">
              <FaCog className="text-3xl text-orange-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Settings</h3>
              <p className="text-sm text-gray-600">Configure system settings</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">System Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Application Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Database Status</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">AI Integration</span>
                <span className="font-medium text-blue-600">Claude API</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Last Backup</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">User Management</h3>
          <div className="mb-6">
            <button className="btn btn-primary flex items-center gap-2">
              <FaUserPlus />
              Add New User
            </button>
          </div>
          <p className="text-gray-500 text-center py-8">
            User management interface - Create, edit, and manage user accounts
          </p>
        </div>
      )}

      {/* Bulk Upload Tab */}
      {activeTab === 'bulk-upload' && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Bulk Data Upload</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FaFileUpload className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Upload CSV file for bulk import</p>
              <input type="file" accept=".csv" className="hidden" id="csv-upload" />
              <label htmlFor="csv-upload" className="btn btn-primary cursor-pointer">
                Choose CSV File
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">CSV Format Guide</h4>
              <p className="text-sm text-blue-800 mb-2">
                For marks upload, use the following columns:
              </p>
              <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                studentId, subject, examName, marks, maxMarks, examDate
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Name
                </label>
                <input
                  type="text"
                  defaultValue="EduFlow Suite"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Time Zone
                </label>
                <select className="input">
                  <option>UTC</option>
                  <option>Asia/Kolkata</option>
                  <option>America/New_York</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">AI Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Claude API Status
                </label>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Configured
                  </span>
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    Test Connection
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Email Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Server
                </label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email From Address
                </label>
                <input
                  type="email"
                  placeholder="noreply@eduflow.com"
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="btn btn-primary">Save Settings</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
