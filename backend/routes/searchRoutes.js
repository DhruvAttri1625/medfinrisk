import express from 'express';
import Search from '../models/Search.js';

const router = express.Router();

// SAVE search
router.post('/save', async (req, res) => {
    console.log("DATA RECEIVED:", req.body);
  try {
    const data = new Search(req.body);
    await data.save();
    res.status(201).json({ message: 'Saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all searches
router.get('/', async (req, res) => {
  const data = await Search.find().sort({ createdAt: -1 });
  res.json(data);
});

export default router; 