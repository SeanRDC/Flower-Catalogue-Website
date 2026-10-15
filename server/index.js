import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Flower from './models/Flower.js';
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import { requireAuth } from './middleware/auth.js';
import { classifyFlower, FLOWER_TRAITS } from './lib/classifyFlower.js';

dotenv.config();

const app = express();

// Optionally restrict which sites may call the API, e.g.
// CLIENT_ORIGIN=https://flower-catalogue-website.vercel.app,http://localhost:5173
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors(allowedOrigins?.length ? { origin: allowedOrigins } : undefined));
app.use(express.json({ limit: '20kb' }));

app.use('/api/auth', authRoutes);

// Re-derive each flower's filter traits from the shared classifier and fix
// any that differ, so classifier fixes reach existing data without a reseed
// (a reseed would change every flower's id and break saved favorites).
const syncFlowerTraits = async () => {
  try {
    const flowers = await Flower.find({}, 'commonName family description color petalShape type symbolism').lean();
    const updates = [];
    for (const flower of flowers) {
      const traits = classifyFlower(flower.commonName, flower.family, flower.description);
      const changed = Object.keys(traits).filter((key) => flower[key] !== traits[key]);
      if (changed.length) {
        updates.push({ updateOne: { filter: { _id: flower._id }, update: { $set: traits } } });
        console.log(`[sync] ${flower.commonName}: ${changed.map((k) => `${k} ${flower[k]} -> ${traits[k]}`).join(', ')}`);
      }
    }
    if (updates.length) await Flower.bulkWrite(updates);
    console.log(`[sync] Flower traits checked: ${flowers.length}, updated: ${updates.length}`);
  } catch (err) {
    console.error('[sync] Could not sync flower traits:', err.message);
  }
};

// Keep retrying instead of giving up after one failed attempt, so a brief
// Atlas outage during a cold start doesn't leave the server broken.
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => {
      console.log('Connected to MongoDB Atlas');
      syncFlowerTraits();
    })
    .catch((err) => {
      console.error('Could not connect to MongoDB, retrying in 10s:', err.message);
      setTimeout(connectWithRetry, 10000);
    });
};
connectWithRetry();

app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({ status: dbConnected ? 'ok' : 'database unavailable' });
});

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MAX_PAGE_SIZE = 250;
const DEFAULT_COLLECTION = 'My Collection';

app.get('/api/flowers', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), MAX_PAGE_SIZE);
    const skip = (page - 1) * limit;

    const { search, color, petalShape, type, symbolism } = req.query;

    const query = {};

    if (typeof search === 'string' && search.trim()) {
      const pattern = { $regex: escapeRegex(search.trim().slice(0, 100)), $options: 'i' };
      query.$or = [
        { commonName: pattern },
        { scientificName: pattern },
        { family: pattern }
      ];
    }

    if (typeof color === 'string' && color) query.color = color;
    if (typeof petalShape === 'string' && petalShape) query.petalShape = petalShape;
    if (typeof type === 'string' && type) query.type = type;
    if (typeof symbolism === 'string' && symbolism) query.symbolism = symbolism;

    const [flowers, total] = await Promise.all([
      Flower.find(query).select('-__v -tags').skip(skip).limit(limit).lean(),
      Flower.countDocuments(query),
    ]);

    // Let browsers briefly reuse real results, but never cache an empty list:
    // while Atlas is resuming the server can return [] for a moment, and a
    // cached empty response would keep the catalogue blank for visitors.
    res.set('Cache-Control', flowers.length > 0 ? 'public, max-age=60' : 'no-store');
    res.json({
      flowers,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Fetch flowers error:', error);
    res.status(500).json({ error: 'Could not load flowers' });
  }
});

// Filter options with live counts. Each trait's counts respect the filters
// chosen for the *other* traits, so the UI can show how many flowers each
// option would return and disable options that would return none.
app.get('/api/flowers/facets', async (req, res) => {
  try {
    const selected = {};
    for (const key of Object.keys(FLOWER_TRAITS)) {
      if (typeof req.query[key] === 'string' && req.query[key]) selected[key] = req.query[key];
    }

    const flowers = await Flower.find({}, Object.keys(FLOWER_TRAITS).join(' ')).lean();
    const facets = {};
    for (const [key, values] of Object.entries(FLOWER_TRAITS)) {
      const matchesOthers = (flower) =>
        Object.entries(selected).every(([otherKey, value]) => otherKey === key || flower[otherKey] === value);
      const pool = flowers.filter(matchesOthers);
      facets[key] = values.map((value) => ({ value, count: pool.filter((f) => f[key] === value).length }));
    }

    res.set('Cache-Control', 'public, max-age=60');
    res.json({ facets, total: flowers.filter((f) => Object.entries(selected).every(([k, v]) => f[k] === v)).length });
  } catch (error) {
    console.error('Facets error:', error);
    res.status(500).json({ error: 'Could not load filters' });
  }
});

// ==========================================
// USER ASSETS (favorites & collections) — all require a valid login token
// ==========================================
const userRouter = express.Router();
userRouter.use(requireAuth);

const validFlowerId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.body.flowerId)) {
    return res.status(400).json({ message: 'Invalid flower id' });
  }
  next();
};

const toPublicUser = (user) => ({
  id: user._id,
  email: user.email,
  favorites: user.favorites,
  collections: user.collections,
});

userRouter.get('/user/me', async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('favorites', '-__v -tags')
      .populate('collections.flowers', '-__v -tags')
      .lean();

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Drop references to flowers that no longer exist (e.g. after a reseed)
    user.favorites = user.favorites.filter(Boolean);
    user.collections.forEach((c) => { c.flowers = c.flowers.filter(Boolean); });

    res.json(toPublicUser(user));
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ message: 'Could not load your saved flowers' });
  }
});

userRouter.post('/favorites', validFlowerId, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { favorites: req.body.flowerId } },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Added to favorites', user: toPublicUser(user) });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Could not save favorite' });
  }
});

userRouter.post('/favorites/remove', validFlowerId, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $pull: { favorites: req.body.flowerId } },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Removed from favorites', user: toPublicUser(user) });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Could not remove favorite' });
  }
});

userRouter.post('/favorites/clear', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { favorites: [] } },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Cleared all favorites', user: toPublicUser(user) });
  } catch (error) {
    console.error('Clear favorites error:', error);
    res.status(500).json({ message: 'Could not clear favorites' });
  }
});

userRouter.post('/collections', validFlowerId, async (req, res) => {
  const { flowerId } = req.body;
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const collection = user.collections.find((c) => c.name === DEFAULT_COLLECTION);
    if (!collection) {
      user.collections.push({ name: DEFAULT_COLLECTION, flowers: [flowerId] });
    } else if (!collection.flowers.some((id) => id.toString() === flowerId)) {
      collection.flowers.push(flowerId);
    }
    await user.save();

    res.json({ message: 'Added to collections', user: toPublicUser(user) });
  } catch (error) {
    console.error('Add to collection error:', error);
    res.status(500).json({ message: 'Could not save to collection' });
  }
});

userRouter.post('/collections/remove', validFlowerId, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.userId, 'collections.name': DEFAULT_COLLECTION },
      { $pull: { 'collections.$.flowers': req.body.flowerId } },
      { new: true }
    ).select('-password');
    res.json({ message: 'Removed from collections', user: user && toPublicUser(user) });
  } catch (error) {
    console.error('Remove from collection error:', error);
    res.status(500).json({ message: 'Could not remove from collection' });
  }
});

userRouter.post('/collections/clear', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.userId, 'collections.name': DEFAULT_COLLECTION },
      { $set: { 'collections.$.flowers': [] } },
      { new: true }
    ).select('-password');
    res.json({ message: 'Cleared all collections', user: user && toPublicUser(user) });
  } catch (error) {
    console.error('Clear collection error:', error);
    res.status(500).json({ message: 'Could not clear collection' });
  }
});

app.use('/api', userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
