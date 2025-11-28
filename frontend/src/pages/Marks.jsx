// frontend/src/pages/Marks.jsx
import { useState, useEffect } from 'react';
import { marksAPI, studentsAPI } from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFileUpload, FaClipboardList } from 'react-icons/fa';

const Marks = () => {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMark, setEditingMark] = useState(null);
  const [formData, setFormData] = useState({});
  const [bulkFormData, setBulkFormData] = useState({
    student: '',
    examName: '',
    examDate: new Date().toISOString().split('T')[0],
    maxMarks: 100,
    subjects: {}
  });

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];

  const subjectGroups = {
    'Core Subjects': ['Mathematics', 'Science', 'English'],
    'Humanities': ['History', 'Geography'],
    'Advanced Sciences': ['Physics', 'Chemistry', 'Biology']
  };

  const subjectEmojis = {
    'Mathematics': '🔢',
    'Science': '🔬',
    'English': '📚',
    'History': '🏛️',
    'Geography': '🌍',
    'Physics': '⚛️',
    'Chemistry': '🧪',
    'Biology': '🧬'
  };

  useEffect(() => {
    fetchMarks();
    fetchStudents();
  }, [search, subjectFilter]);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (subjectFilter) params.subject = subjectFilter;

      const response = await marksAPI.getAll(params);
      setMarks(response.data.marks || []);
    } catch (error) {
      console.error('Error fetching marks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll({ limit: 1000 });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAddMark = () => {
    setFormData({
      student: '',
      subject: '',
      examName: '',
      marks: '',
      maxMarks: 100,
      examDate: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(true);
  };

  const handleCreateMark = async (e) => {
    e.preventDefault();
    try {
      await marksAPI.add(formData);
      setShowAddModal(false);
      fetchMarks();
    } catch (error) {
      console.error('Error creating mark:', error);
      alert(error.response?.data?.message || 'Failed to add marks');
    }
  };

  const handleEdit = (mark) => {
    setEditingMark(mark);
    setFormData({
      student: mark.student._id,
      subject: mark.subject,
      examName: mark.examName,
      marks: mark.marks,
      maxMarks: mark.maxMarks,
      examDate: new Date(mark.examDate).toISOString().split('T')[0]
    });
    setShowEditModal(true);
  };

  const handleUpdateMark = async (e) => {
    e.preventDefault();
    try {
      await marksAPI.update(editingMark._id, formData);
      setShowEditModal(false);
      fetchMarks();
    } catch (error) {
      console.error('Error updating mark:', error);
      alert('Failed to update marks');
    }
  };

  const handleDelete = async (mark) => {
    if (window.confirm(`Are you sure you want to delete marks for ${mark.student.name} in ${mark.subject}?`)) {
      try {
        await marksAPI.delete(mark._id);
        fetchMarks();
      } catch (error) {
        console.error('Error deleting mark:', error);
        alert('Failed to delete marks');
      }
    }
  };

  const handleBulkAddMarksheet = () => {
    // Initialize subjects object with empty marks
    const subjectsData = {};
    subjects.forEach(subject => {
      subjectsData[subject] = '';
    });

    setBulkFormData({
      student: '',
      examName: '',
      examDate: new Date().toISOString().split('T')[0],
      maxMarks: 100,
      subjects: subjectsData
    });
    setShowBulkAddModal(true);
  };

  const handleBulkSubjectChange = (subject, value) => {
    setBulkFormData({
      ...bulkFormData,
      subjects: {
        ...bulkFormData.subjects,
        [subject]: value
      }
    });
  };

  const handleSubmitBulkMarksheet = async (e) => {
    e.preventDefault();

    // Create array of marks for all subjects that have values (including N/A)
    const marksToAdd = [];
    Object.entries(bulkFormData.subjects).forEach(([subject, marksValue]) => {
      if (marksValue !== '' && marksValue !== null) {
        // For N/A subjects, store -1 as marks (backend will handle this)
        const markData = {
          student: bulkFormData.student,
          subject: subject,
          examName: bulkFormData.examName,
          marks: marksValue === 'N/A' ? -1 : parseFloat(marksValue),
          maxMarks: parseFloat(bulkFormData.maxMarks),
          examDate: bulkFormData.examDate
        };
        marksToAdd.push(markData);
      }
    });

    if (marksToAdd.length === 0) {
      alert('Please enter marks for at least one subject');
      return;
    }

    try {
      // Add marks for each subject
      await Promise.all(marksToAdd.map(mark => marksAPI.add(mark)));
      setShowBulkAddModal(false);
      fetchMarks();
      const naCount = marksToAdd.filter(m => m.marks === -1).length;
      const regularCount = marksToAdd.length - naCount;
      alert(`Successfully added marks for ${regularCount} subject(s)${naCount > 0 ? ` and marked ${naCount} as N/A` : ''}!`);
    } catch (error) {
      console.error('Error adding bulk marks:', error);
      alert(error.response?.data?.message || 'Failed to add marks');
    }
  };

  const getGradeColor = (grade) => {
    if (grade === 'N/A') return 'bg-gray-100 text-gray-800';
    if (grade === 'A+' || grade === 'A') return 'bg-green-100 text-green-800';
    if (grade === 'B+' || grade === 'B') return 'bg-blue-100 text-blue-800';
    if (grade === 'C+' || grade === 'C') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Marks Management</h1>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleBulkAddMarksheet} className="btn bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white flex items-center gap-2">
            <FaClipboardList />
            Add Marksheet
          </button>
          <button onClick={handleAddMark} className="btn border-2 border-primary-600 text-primary-600 hover:bg-primary-50 flex items-center gap-2">
            <FaPlus />
            Add Single Mark
          </button>
          <button className="btn bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            <FaFileUpload />
            Upload CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name or exam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="input"
          >
            <option value="">📚 All Subjects</option>
            {Object.entries(subjectGroups).map(([groupName, groupSubjects]) => (
              <optgroup key={groupName} label={groupName}>
                {groupSubjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subjectEmojis[subject]} {subject}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Marks Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading marks...</p>
          </div>
        ) : marks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No marks found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {marks.map((mark) => (
                  <tr key={mark._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{mark.student?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{mark.student?.rollNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mark.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mark.examName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mark.marks === -1 ? 'N/A' : `${mark.marks} / ${mark.maxMarks}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {mark.percentage === -1 ? 'N/A' : `${mark.percentage}%`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(mark.grade)}`}>
                        {mark.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(mark.examDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(mark)}
                        className="text-gray-600 hover:text-gray-900 mr-4"
                      >
                        <FaEdit className="inline" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(mark)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Mark Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Add Marks</h2>
            <form onSubmit={handleCreateMark} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student *</label>
                <select
                  value={formData.student || ''}
                  onChange={(e) => setFormData({...formData, student: e.target.value})}
                  className="input"
                  required
                >
                  <option value="" disabled>👤 Select a student...</option>
                  {Object.entries(
                    students.reduce((acc, student) => {
                      const className = student.class || 'Other';
                      if (!acc[className]) acc[className] = [];
                      acc[className].push(student);
                      return acc;
                    }, {})
                  ).map(([className, classStudents]) => (
                    <optgroup key={className} label={`📚 ${className}`}>
                      {classStudents.map(student => (
                        <option key={student._id} value={student._id}>
                          {student.name} • Roll: {student.rollNumber}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select
                  value={formData.subject || ''}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="input"
                  required
                >
                  <option value="" disabled>📖 Select a subject...</option>
                  {Object.entries(subjectGroups).map(([groupName, groupSubjects]) => (
                    <optgroup key={groupName} label={groupName}>
                      {groupSubjects.map(subject => (
                        <option key={subject} value={subject}>
                          {subjectEmojis[subject]} {subject}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Name *</label>
                <input
                  type="text"
                  value={formData.examName || ''}
                  onChange={(e) => setFormData({...formData, examName: e.target.value})}
                  className="input"
                  placeholder="e.g., Mid-term Exam, Unit Test 1"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marks Obtained *</label>
                  <input
                    type="number"
                    value={formData.marks || ''}
                    onChange={(e) => setFormData({...formData, marks: e.target.value})}
                    className="input"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Marks *</label>
                  <input
                    type="number"
                    value={formData.maxMarks || 100}
                    onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
                    className="input"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Date *</label>
                <input
                  type="date"
                  value={formData.examDate || ''}
                  onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                  className="input"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Add Marksheet Modal */}
      {showBulkAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-primary-600">Add Complete Marksheet</h2>
            <p className="text-gray-600 mb-6">Enter marks for one student across all subjects</p>

            <form onSubmit={handleSubmitBulkMarksheet} className="space-y-6">
              {/* Student and Exam Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      Student *
                    </span>
                  </label>
                  <select
                    value={bulkFormData.student}
                    onChange={(e) => setBulkFormData({...bulkFormData, student: e.target.value})}
                    className="input"
                    required
                  >
                    <option value="" disabled>👤 Select a student...</option>
                    {Object.entries(
                      students.reduce((acc, student) => {
                        const className = student.class || 'Other';
                        if (!acc[className]) acc[className] = [];
                        acc[className].push(student);
                        return acc;
                      }, {})
                    ).map(([className, classStudents]) => (
                      <optgroup key={className} label={`📚 ${className}`}>
                        {classStudents.map(student => (
                          <option key={student._id} value={student._id}>
                            {student.name} • Roll: {student.rollNumber} • {student.section}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam Name *</label>
                  <input
                    type="text"
                    value={bulkFormData.examName}
                    onChange={(e) => setBulkFormData({...bulkFormData, examName: e.target.value})}
                    className="input"
                    placeholder="e.g., Mid-term Exam, Final Exam"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Marks *</label>
                  <input
                    type="number"
                    value={bulkFormData.maxMarks}
                    onChange={(e) => setBulkFormData({...bulkFormData, maxMarks: e.target.value})}
                    className="input"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam Date *</label>
                  <input
                    type="date"
                    value={bulkFormData.examDate}
                    onChange={(e) => setBulkFormData({...bulkFormData, examDate: e.target.value})}
                    className="input"
                    required
                  />
                </div>
              </div>

              {/* All Subjects */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Enter Marks for Each Subject</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.map(subject => (
                    <div key={subject} className="bg-gray-50 p-4 rounded-lg border-2 border-transparent hover:border-primary-200 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {subject}
                        </label>
                        <button
                          type="button"
                          onClick={() => handleBulkSubjectChange(subject, bulkFormData.subjects[subject] === 'N/A' ? '' : 'N/A')}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            bulkFormData.subjects[subject] === 'N/A'
                              ? 'bg-gray-400 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {bulkFormData.subjects[subject] === 'N/A' ? '✓ N/A' : 'Mark N/A'}
                        </button>
                      </div>
                      <input
                        type="number"
                        value={bulkFormData.subjects[subject] === 'N/A' ? '' : (bulkFormData.subjects[subject] || '')}
                        onChange={(e) => handleBulkSubjectChange(subject, e.target.value)}
                        className="input"
                        placeholder={bulkFormData.subjects[subject] === 'N/A' ? 'Not Applicable' : 'Enter marks'}
                        min="0"
                        max={bulkFormData.maxMarks}
                        step="0.01"
                        disabled={bulkFormData.subjects[subject] === 'N/A'}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  <span className="font-medium">Tip:</span> Click "Mark N/A" for subjects the student doesn't take. Leave blank to skip entering marks.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowBulkAddModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6"
                >
                  Add Marksheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Mark Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Edit Marks</h2>
            <form onSubmit={handleUpdateMark} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select
                  value={formData.subject || ''}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="input"
                  required
                >
                  <option value="" disabled>📖 Select a subject...</option>
                  {Object.entries(subjectGroups).map(([groupName, groupSubjects]) => (
                    <optgroup key={groupName} label={groupName}>
                      {groupSubjects.map(subject => (
                        <option key={subject} value={subject}>
                          {subjectEmojis[subject]} {subject}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Name *</label>
                <input
                  type="text"
                  value={formData.examName || ''}
                  onChange={(e) => setFormData({...formData, examName: e.target.value})}
                  className="input"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marks Obtained *</label>
                  <input
                    type="number"
                    value={formData.marks || ''}
                    onChange={(e) => setFormData({...formData, marks: e.target.value})}
                    className="input"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Marks *</label>
                  <input
                    type="number"
                    value={formData.maxMarks || 100}
                    onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
                    className="input"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Date *</label>
                <input
                  type="date"
                  value={formData.examDate || ''}
                  onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                  className="input"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marks;
