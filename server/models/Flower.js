import mongoose from 'mongoose';

const flowerSchema = new mongoose.Schema({
  commonName: { type: String, required: true, index: true },
  scientificName: { type: String, required: true },
  family: { type: String },
  lifecycle: { type: String, enum: ['Annual', 'Biennial', 'Perennial'] },
  description: { type: String },
  imageUrl: { type: String, required: true },
  tags: [String],
  color: { type: String },
  petalShape: { type: String },
  type: { type: String },
  symbolism: { type: String }
});

export default mongoose.model('Flower', flowerSchema);