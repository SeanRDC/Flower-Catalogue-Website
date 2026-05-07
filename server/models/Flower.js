import mongoose from 'mongoose';

const flowerSchema = new mongoose.Schema({
  commonName: { type: String, required: true, index: true },
  scientificName: { type: String, required: true },
  family: { type: String },
  description: { type: String },
  imageUrl: { type: String, required: true },
  tags: [String]
});

export default mongoose.model('Flower', flowerSchema);