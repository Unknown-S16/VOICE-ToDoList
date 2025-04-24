const express = require('express');
const router = express.Router();
const Task = require('../models/model');

// POST: Add task
router.post('/add', async (req, res) => {
  const { text} = req.body;
  try {
    const newTask = new Task({ text });
    await newTask.save();
    res.status(200).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT: Update task completion
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ success: true });
});
router.get('/ping', (req, res) => {
  res.send('pong');
});

module.exports = router;
