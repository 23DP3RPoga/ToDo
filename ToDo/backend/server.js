const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/todolist', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Serveris darbojas!');
  });