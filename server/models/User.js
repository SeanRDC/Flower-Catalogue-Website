import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,       
    lowercase: true   
  },
  // Not set for accounts created through Google sign-in
  password: {
    type: String
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  favorites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Flower' 
  }],
  collections: [{
    name: String,
    flowers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flower' }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);