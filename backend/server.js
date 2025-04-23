const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const dotenv =require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);

mongoose.connect(process.env.MongoDB).then(() => {
  console.log('MongoDB connected');
  app.listen( process.env.PORT , () => console.log('Server started on port 5000'));
}).catch(err => console.log(err));
