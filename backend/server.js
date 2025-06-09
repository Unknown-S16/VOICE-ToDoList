const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors({
  origin: ["https://voice-to-do-list.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use('/api/tasks', taskRoutes);

// Add this root route:
app.get('/', (req, res) => {
  res.send('API is live and running!');
});

mongoose.connect(process.env.MongoDB).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => console.log('Server started on port', process.env.PORT));
}).catch(err => console.log(err));
