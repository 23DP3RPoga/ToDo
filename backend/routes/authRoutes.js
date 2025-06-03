const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'Cepums'; // Change this to a secure secret in production!

// Register (Sign up)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: 'Username already exists' });

    const user = new User({ username, password });
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
