import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

app.use('/api/auth', authRoutes);

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('API running...');
});

// connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// routes
import searchRoutes from './routes/searchRoutes.js';
app.use('/api/search', searchRoutes);

// start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});