import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flower' }],
  collections: [{
    name: String,
    flowers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flower' }]
  }]
});

export default mongoose.model('User', userSchema);