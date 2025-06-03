const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authenticateToken = require('../middleware/authMiddleware');

// Get all tasks for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log("Authenticated userId:", req.user.userId);
    const tasks = await Task.find({ userId: req.user.userId });
    console.log("Tasks found for this user:", tasks);
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Add a new task for the authenticated user
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, status } = req.body;
  console.log("Decoded userId from token:", req.user.userId);

  const task = new Task({
    title,
    description,
    status: status || 'Not Completed',
    userId: req.user.userId,
  });

  try {
    await task.save();
    res.json(task);
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Update an existing task by ID for the authenticated user
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.userId }, // Use userId from token correctly here
      { title, description, status },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete an existing task by ID for the authenticated user
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId }); // Fix here too
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
