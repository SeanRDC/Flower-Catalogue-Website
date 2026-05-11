import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Flower from './models/Flower.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.get('/api/flowers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    let query = {};
    if (search) {
      query = {
        $or: [
          { commonName: { $regex: search, $options: 'i' } },
          { scientificName: { $regex: search, $options: 'i' } },
          { family: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const flowers = await Flower.find(query).skip(skip).limit(limit);
    const total = await Flower.countDocuments(query);

    res.json({ flowers, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));