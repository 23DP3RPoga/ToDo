const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./backend/routes/authRoutes');
const taskRoutes = require('./backend/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB savienojums
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// API maršruti
app.use('/api/auth', require('./backend/routes/authRoutes'));
app.use('/api/tasks',require('./backend/routes/taskRoutes'));

// Serve frontend
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is woriking: http://localhost:${PORT}`);
});
