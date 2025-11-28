// backend/controllers/aiController.js
import { generateStudyPlan, prioritizeTasks, generateHabitAdvice } from '../utils/claudeClient.js';
import Task from '../models/Task.js';
import Habit from '../models/Habit.js';

// @desc    Generate study plan using Claude AI
// @route   POST /api/ai/study-plan
// @access  Private
export const getStudyPlan = async (req, res) => {
  try {
    const { studentName, subject, marks, maxMarks } = req.body;

    // Validation
    if (!studentName || !subject || marks === undefined || !maxMarks) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentName, subject, marks, and maxMarks'
      });
    }

    // Generate study plan
    const studyPlan = await generateStudyPlan({
      studentName,
      subject,
      marks,
      maxMarks
    });

    res.json({
      success: true,
      studyPlan,
      metadata: {
        studentName,
        subject,
        marks,
        maxMarks,
        percentage: ((marks / maxMarks) * 100).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Get study plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate study plan',
      error: error.message
    });
  }
};

// @desc    Prioritize tasks using Claude AI
// @route   POST /api/ai/prioritize
// @access  Private
export const prioritizeUserTasks = async (req, res) => {
  try {
    let { tasks } = req.body;

    // If no tasks provided, fetch user's incomplete tasks
    if (!tasks || tasks.length === 0) {
      tasks = await Task.find({
        user: req.user.id,
        completed: false
      }).sort({ dueDate: 1 });
    }

    if (tasks.length === 0) {
      return res.json({
        success: true,
        message: 'No tasks to prioritize',
        advice: 'Great job! You have no pending tasks. Time to add new goals or take a well-deserved break!',
        prioritizedTasks: []
      });
    }

    // Prioritize tasks
    const result = await prioritizeTasks(tasks);

    // Update AI priority in database for top 3 tasks
    if (result.prioritizedTasks && result.prioritizedTasks.length > 0) {
      for (let i = 0; i < result.prioritizedTasks.length; i++) {
        const task = result.prioritizedTasks[i];
        if (task._id) {
          await Task.findByIdAndUpdate(task._id, {
            aiPriority: result.prioritizedTasks.length - i,
            aiReason: 'AI suggested as top priority based on urgency and importance'
          });
        }
      }
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Prioritize tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to prioritize tasks',
      error: error.message
    });
  }
};

// @desc    Get habit building advice using Claude AI
// @route   POST /api/ai/habit-tip
// @access  Private
export const getHabitTip = async (req, res) => {
  try {
    let { habitData } = req.body;

    // If no habit data provided, use habitId
    if (!habitData && req.body.habitId) {
      const habit = await Habit.findById(req.body.habitId);

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

      habitData = {
        name: habit.name,
        currentStreak: habit.currentStreak,
        longestStreak: habit.longestStreak,
        frequency: habit.frequency,
        totalCompletions: habit.totalCompletions
      };
    }

    // Validation
    if (!habitData || !habitData.name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide habit data or habitId'
      });
    }

    // Generate habit advice
    const advice = await generateHabitAdvice(habitData);

    res.json({
      success: true,
      advice,
      habitData
    });
  } catch (error) {
    console.error('Get habit tip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate habit advice',
      error: error.message
    });
  }
};

// @desc    General AI assistant for education-related queries
// @route   POST /api/ai/ask
// @access  Private
export const askAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question'
      });
    }

    // Import callClaude directly
    const { callClaude } = await import('../utils/claudeClient.js');

    const prompt = `You are an educational assistant for EduFlow Suite. A user asks: "${question}"

Provide a helpful, concise, and actionable response. Keep it friendly and encouraging.`;

    const response = await callClaude(prompt, 1500);

    res.json({
      success: true,
      question,
      response
    });
  } catch (error) {
    console.error('Ask AI error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response',
      error: error.message
    });
  }
};
