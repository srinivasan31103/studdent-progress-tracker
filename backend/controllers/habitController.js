// backend/controllers/habitController.js
import Habit from '../models/Habit.js';

// @desc    Create habit
// @route   POST /api/habits
// @access  Private
export const createHabit = async (req, res) => {
  try {
    const { name, description, frequency, targetDays, color } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Habit name is required'
      });
    }

    const habit = await Habit.create({
      user: req.user.id,
      name,
      description,
      frequency: frequency || 'daily',
      targetDays: targetDays || 1,
      color: color || '#3B82F6'
    });

    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      habit
    });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create habit',
      error: error.message
    });
  }
};

// @desc    Get user's habits
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req, res) => {
  try {
    const { isActive } = req.query;

    const query = { user: req.user.id };

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const habits = await Habit.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      habits,
      count: habits.length
    });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch habits',
      error: error.message
    });
  }
};

// @desc    Get single habit
// @route   GET /api/habits/:id
// @access  Private
export const getHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    // Ensure user owns this habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      habit
    });
  } catch (error) {
    console.error('Get habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch habit',
      error: error.message
    });
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    // Ensure user owns this habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { name, description, frequency, targetDays, color, isActive } = req.body;

    if (name) habit.name = name;
    if (description !== undefined) habit.description = description;
    if (frequency) habit.frequency = frequency;
    if (targetDays) habit.targetDays = targetDays;
    if (color) habit.color = color;
    if (isActive !== undefined) habit.isActive = isActive;

    await habit.save();

    res.json({
      success: true,
      message: 'Habit updated successfully',
      habit
    });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update habit',
      error: error.message
    });
  }
};

// @desc    Mark habit as done for today
// @route   PUT /api/habits/:id/done
// @access  Private
export const markHabitDone = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    // Ensure user owns this habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already marked today
    const alreadyMarkedToday = habit.completionHistory.some(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    if (alreadyMarkedToday) {
      return res.status(400).json({
        success: false,
        message: 'Habit already marked as done today'
      });
    }

    // Add to completion history
    habit.completionHistory.push({
      date: today,
      completed: true
    });

    // Update streak logic
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const wasCompletedYesterday = habit.completionHistory.some(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === yesterday.getTime() && entry.completed;
    });

    if (wasCompletedYesterday || habit.currentStreak === 0) {
      habit.currentStreak += 1;
    } else {
      habit.currentStreak = 1;
    }

    // Update longest streak
    if (habit.currentStreak > habit.longestStreak) {
      habit.longestStreak = habit.currentStreak;
    }

    // Update total completions
    habit.totalCompletions += 1;
    habit.lastCompletedDate = today;

    await habit.save();

    res.json({
      success: true,
      message: `Habit marked as done! Current streak: ${habit.currentStreak} days`,
      habit
    });
  } catch (error) {
    console.error('Mark habit done error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark habit as done',
      error: error.message
    });
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    // Ensure user owns this habit
    if (habit.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await habit.deleteOne();

    res.json({
      success: true,
      message: 'Habit deleted successfully'
    });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete habit',
      error: error.message
    });
  }
};
