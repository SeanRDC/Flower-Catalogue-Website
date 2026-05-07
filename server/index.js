import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Flower from './models/Flower.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/peony_catalogue');

app.get('/api/flowers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const flowers = await Flower.find().skip(skip).limit(limit);
    const total = await Flower.countDocuments();

    res.json({ flowers, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));