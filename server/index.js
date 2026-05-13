import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Flower from './models/Flower.js';
import User from './models/User.js';

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

app.post('/api/favorites', async (req, res) => {
  const { email, flowerId } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email }, 
      { $addToSet: { favorites: flowerId } },
      { new: true, upsert: true }
    );
    res.json({ message: 'Added to favorites', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/collections', async (req, res) => {
  const { email, flowerId } = req.body;
  const defaultCollectionName = "My Collection";
  
  try {
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({ 
        email, 
        favorites: [], 
        collections: [{ name: defaultCollectionName, flowers: [flowerId] }] 
      });
      await user.save();
      return res.json({ message: 'Added to collections', user });
    }

    const collectionIndex = user.collections.findIndex(c => c.name === defaultCollectionName);
    
    if (collectionIndex > -1) {
      if (!user.collections[collectionIndex].flowers.includes(flowerId)) {
         user.collections[collectionIndex].flowers.push(flowerId);
         await user.save();
      }
    } else {
      user.collections.push({ name: defaultCollectionName, flowers: [flowerId] });
      await user.save();
    }
    
    res.json({ message: 'Added to collections', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email })
      .populate('favorites')
      .populate('collections.flowers');
      
    if (!user) return res.json({ favorites: [], collections: [] });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));