// frontend/src/pages/Habits.jsx
import { useState, useEffect } from 'react';
import { habitsAPI, aiAPI } from '../utils/api';
import { FaPlus, FaFire, FaCheckCircle, FaTrash, FaLightbulb, FaSpinner } from 'react-icons/fa';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [aiTip, setAiTip] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    targetDays: 1,
    color: '#3B82F6'
  });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await habitsAPI.getAll({ isActive: true });
      setHabits(response.data.habits || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      await habitsAPI.create(newHabit);
      setNewHabit({
        name: '',
        description: '',
        frequency: 'daily',
        targetDays: 1,
        color: '#3B82F6'
      });
      setShowAddForm(false);
      fetchHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
      alert('Failed to add habit');
    }
  };

  const handleMarkDone = async (habitId) => {
    try {
      await habitsAPI.markDone(habitId);
      fetchHabits();
    } catch (error) {
      console.error('Error marking habit done:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await habitsAPI.delete(habitId);
        fetchHabits();
      } catch (error) {
        console.error('Error deleting habit:', error);
      }
    }
  };

  const getHabitTip = async (habit) => {
    setLoadingAI(true);
    setAiTip('');
    try {
      const response = await aiAPI.getHabitTip({
        habitData: {
          name: habit.name,
          currentStreak: habit.currentStreak,
          longestStreak: habit.longestStreak,
          frequency: habit.frequency,
          totalCompletions: habit.totalCompletions
        }
      });
      setAiTip(response.data.advice);
    } catch (error) {
      console.error('Error getting habit tip:', error);
      setAiTip('Failed to get AI advice. Please try again.');
    } finally {
      setLoadingAI(false);
    }
  };

  const colors = [
    { value: '#3B82F6', name: 'Blue' },
    { value: '#10B981', name: 'Green' },
    { value: '#F59E0B', name: 'Orange' },
    { value: '#EF4444', name: 'Red' },
    { value: '#8B5CF6', name: 'Purple' },
    { value: '#EC4899', name: 'Pink' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Habit Tracker</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FaPlus />
          Add Habit
        </button>
      </div>

      {/* AI Tip */}
      {aiTip && (
        <div className="card bg-green-50 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
            <FaLightbulb className="text-green-600" />
            AI Habit Building Tip
          </h3>
          <pre className="whitespace-pre-wrap text-sm text-green-800 font-sans">{aiTip}</pre>
        </div>
      )}

      {/* Add Habit Form */}
      {showAddForm && (
        <div className="card bg-gray-50">
          <h3 className="font-semibold mb-4">Create New Habit</h3>
          <form onSubmit={handleAddHabit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Habit Name</label>
              <input
                type="text"
                required
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                className="input"
                placeholder="e.g., Morning Exercise, Read for 30 minutes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                className="input"
                rows="2"
                placeholder="Optional description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                  className="input"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Days</label>
                <input
                  type="number"
                  min="1"
                  value={newHabit.targetDays}
                  onChange={(e) => setNewHabit({ ...newHabit, targetDays: parseInt(e.target.value) })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <select
                  value={newHabit.color}
                  onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })}
                  className="input"
                >
                  {colors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary">Create Habit</button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading habits...</p>
          </div>
        ) : habits.length === 0 ? (
          <div className="col-span-full card text-center py-8">
            <p className="text-gray-500">No habits found. Start building good habits today!</p>
          </div>
        ) : (
          habits.map((habit) => (
            <div
              key={habit._id}
              className="card hover:shadow-lg transition-shadow"
              style={{ borderLeft: `4px solid ${habit.color}` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{habit.name}</h3>
                <button
                  onClick={() => handleDeleteHabit(habit._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={14} />
                </button>
              </div>

              {habit.description && (
                <p className="text-sm text-gray-600 mb-4">{habit.description}</p>
              )}

              {/* Streak Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                  <FaFire size={24} />
                  <span className="text-3xl font-bold">{habit.currentStreak}</span>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Current Streak ({habit.frequency})
                </p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-center">
                  <div>
                    <p className="text-gray-500">Longest</p>
                    <p className="font-semibold">{habit.longestStreak} days</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <p className="font-semibold">{habit.totalCompletions}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => handleMarkDone(habit._id)}
                  className="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                  <FaCheckCircle />
                  Mark as Done Today
                </button>
                <button
                  onClick={() => getHabitTip(habit)}
                  disabled={loadingAI}
                  className="w-full btn btn-secondary flex items-center justify-center gap-2"
                >
                  {loadingAI ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <FaLightbulb />
                      Get Habit Tip
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Habits;
