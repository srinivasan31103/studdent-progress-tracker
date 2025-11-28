// backend/utils/claudeClient.js
import axios from 'axios';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-opus-20240229';
const API_VERSION = '2023-06-01';

/**
 * Call Claude AI API with a given prompt
 * @param {string} prompt - The prompt to send to Claude
 * @param {number} maxTokens - Maximum tokens in response (default: 1024)
 * @returns {Promise<string>} - Claude's response text
 */
export async function callClaude(prompt, maxTokens = 1024) {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey || apiKey === 'sk-ant-api03-your-claude-api-key-here') {
    console.warn('⚠️  Claude API key not configured. Returning fallback response.');
    return getFallbackResponse(prompt);
  }

  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: CLAUDE_MODEL,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': API_VERSION
        },
        timeout: 30000 // 30 second timeout
      }
    );

    if (response.data && response.data.content && response.data.content[0]) {
      return response.data.content[0].text;
    }

    console.error('Unexpected Claude API response format:', response.data);
    return getFallbackResponse(prompt);

  } catch (error) {
    console.error('Claude API Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.error('Invalid Claude API key');
    } else if (error.response?.status === 429) {
      console.error('Claude API rate limit exceeded');
    }

    return getFallbackResponse(prompt);
  }
}

/**
 * Generate study plan for a student based on marks
 * Example prompt: "Student John scored 65/100 in Mathematics. Provide a personalized study plan..."
 * @param {Object} data - { studentName, subject, marks, maxMarks }
 * @returns {Promise<string>}
 */
export async function generateStudyPlan(data) {
  const { studentName, subject, marks, maxMarks } = data;
  const percentage = ((marks / maxMarks) * 100).toFixed(2);

  const prompt = `You are an experienced education consultant. A student named ${studentName} scored ${marks} out of ${maxMarks} (${percentage}%) in ${subject}.

Please provide:
1. A brief assessment of their performance (2-3 sentences)
2. A personalized study plan with 3-5 specific actionable recommendations
3. Suggested topics to focus on for improvement
4. Motivational advice to help them improve

Keep the response concise, friendly, and encouraging. Format it clearly with bullet points or numbered lists.`;

  return await callClaude(prompt, 1500);
}

/**
 * Prioritize tasks using AI
 * Example prompt: "I have these tasks: [task1, task2, task3]. Help me prioritize..."
 * @param {Array} tasks - Array of task objects with title, priority, dueDate
 * @returns {Promise<Object>} - { advice: string, prioritizedTasks: Array }
 */
export async function prioritizeTasks(tasks) {
  if (!tasks || tasks.length === 0) {
    return {
      advice: 'No tasks to prioritize.',
      prioritizedTasks: []
    };
  }

  const taskList = tasks.map((task, idx) =>
    `${idx + 1}. ${task.title} (Priority: ${task.priority}, Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}, Category: ${task.category || 'other'})`
  ).join('\n');

  const prompt = `You are a productivity expert. A user has the following tasks:

${taskList}

Please:
1. Analyze the tasks based on urgency, importance, and due dates
2. Suggest the top 3 tasks they should focus on today
3. Provide brief reasoning for your prioritization (2-3 sentences)
4. Give one productivity tip

Respond in a clear, actionable format.`;

  const advice = await callClaude(prompt, 1200);

  // For demo purposes, sort tasks by priority and due date
  const prioritized = [...tasks].sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);

    if (priorityDiff !== 0) return priorityDiff;

    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }

    return 0;
  });

  return {
    advice,
    prioritizedTasks: prioritized.slice(0, 3)
  };
}

/**
 * Generate habit-building advice
 * Example prompt: "User is trying to build a habit of reading daily. Current streak is 5 days..."
 * @param {Object} habitData - { name, currentStreak, frequency, totalCompletions }
 * @returns {Promise<string>}
 */
export async function generateHabitAdvice(habitData) {
  const { name, currentStreak, frequency, totalCompletions, longestStreak } = habitData;

  const prompt = `You are a habit-building coach. A user is working on building the following habit:

Habit: ${name}
Frequency: ${frequency}
Current Streak: ${currentStreak} days
Longest Streak: ${longestStreak || 0} days
Total Completions: ${totalCompletions || 0}

Please provide:
1. Encouragement based on their current progress (2-3 sentences)
2. 2-3 specific tips to maintain or improve their streak
3. A motivational quote or advice to keep them going

Keep the tone positive, supportive, and actionable.`;

  return await callClaude(prompt, 1000);
}

/**
 * Fallback responses when Claude API is unavailable
 * @param {string} prompt
 * @returns {string}
 */
function getFallbackResponse(prompt) {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('study plan') || lowerPrompt.includes('scored')) {
    return `📚 **Study Plan Suggestion**

**Performance Assessment:**
Your recent performance shows areas for improvement. With focused effort and strategic study, you can significantly enhance your understanding.

**Recommended Action Steps:**
1. **Review fundamentals** - Revisit core concepts and ensure strong foundation
2. **Practice regularly** - Dedicate 30-45 minutes daily to focused practice
3. **Seek help** - Don't hesitate to ask teachers or peers for clarification
4. **Use multiple resources** - Combine textbooks, online tutorials, and practice tests
5. **Track progress** - Monitor improvement weekly to stay motivated

**Topics to Focus On:**
- Core concepts that appear frequently in assessments
- Problem-solving techniques and application-based questions
- Time management during exams

**Motivation:**
Remember, every expert was once a beginner. Consistent effort and smart study strategies will lead to improvement. You've got this! 💪

*Note: Claude AI is not configured. This is a default suggestion. Configure CLAUDE_API_KEY for personalized AI responses.*`;
  }

  if (lowerPrompt.includes('prioritize') || lowerPrompt.includes('tasks')) {
    return `✅ **Task Prioritization Advice**

**Today's Focus:**
1. Start with high-priority items that have upcoming deadlines
2. Tackle urgent tasks first thing in the morning when energy is high
3. Break large tasks into smaller, manageable chunks

**Productivity Tip:**
Use the "Eat the Frog" technique - complete your most challenging or important task first. This builds momentum and reduces procrastination throughout the day.

**Time Management:**
- Urgent + Important = Do now
- Important but not urgent = Schedule it
- Urgent but not important = Delegate if possible
- Neither urgent nor important = Consider if it's necessary

Stay focused and take regular breaks! 🎯

*Note: Claude AI is not configured. Configure CLAUDE_API_KEY for personalized AI task analysis.*`;
  }

  if (lowerPrompt.includes('habit')) {
    return `🌟 **Habit Building Advice**

**Great Progress!**
You're building positive momentum! Every day you complete your habit, you're rewiring your brain and getting closer to making it automatic.

**Tips to Maintain Your Streak:**
1. **Stack habits** - Attach your new habit to an existing routine (e.g., "After I brush my teeth, I will...")
2. **Start small** - If you miss a day, don't aim for perfection. Aim for consistency. Even 5 minutes counts!
3. **Track visibly** - Mark your calendar or use a habit tracker to visualize your progress
4. **Prepare your environment** - Make it easy to do the habit and hard to skip it

**Motivational Wisdom:**
"Success is the sum of small efforts repeated day in and day out." - Robert Collier

Remember: Missing one day doesn't break a habit. Giving up does. Keep going! 💪

*Note: Claude AI is not configured. Configure CLAUDE_API_KEY for personalized habit coaching.*`;
  }

  return `Thank you for using EduFlow Suite!

The AI feature requires Claude API configuration. Please set your CLAUDE_API_KEY in the .env file to enable personalized AI-powered insights and recommendations.

For now, here's a general tip: Consistency and focused effort are the keys to success in both learning and habit building. Break down your goals into small, manageable steps and celebrate each milestone! 🎯`;
}

export default {
  callClaude,
  generateStudyPlan,
  prioritizeTasks,
  generateHabitAdvice
};
