const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks
router.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// POST new task
router.post('/', async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
});

// PUT update task
router.put('/:id', async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
});

// DELETE task
router.delete('/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Uzdevums dzēsts' });
});

module.exports = router;
