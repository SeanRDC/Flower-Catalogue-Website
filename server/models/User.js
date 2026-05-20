import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,       
    lowercase: true   
  },
  password: { 
    type: String, 
    required: true 
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