import mongoose from 'mongoose';
import Flower from './models/Flower.js';

const seedData = [
  {
    commonName: "Peony",
    scientificName: "Paeonia",
    family: "Paeoniaceae",
    description: "Known for their large, fragrant blooms.",
    imageUrl: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=800"
  },
  {
    commonName: "Corpse Flower",
    scientificName: "Amorphophallus titanum",
    family: "Araceae",
    description: "Famous for its massive size and strong odor.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Amorphophallus_titanum_in_bloom.jpg"
  }
];

// NOTE: Run script once to populate DB: node seed.js