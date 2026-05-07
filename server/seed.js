import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Flower from './models/Flower.js';

dotenv.config();

const seedData = [
  {
    commonName: "Peony",
    scientificName: "Paeonia",
    family: "Paeoniaceae",
    description: "Known for their large, often fragrant blooms, blooming in late spring and early summer.",
    imageUrl: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=800&q=80",
    tags: ["spring", "fragrant", "pink"]
  },
  {
    commonName: "Sunflower",
    scientificName: "Helianthus annuus",
    family: "Asteraceae",
    description: "Tall annuals with large yellow flower heads that track the sun.",
    imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80",
    tags: ["summer", "yellow", "tall"]
  },
  {
    commonName: "Blue Iris",
    scientificName: "Iris croatica",
    family: "Iridaceae",
    description: "Showy flowers with complex, intricate petals often in deep purples and blues.",
    imageUrl: "https://images.unsplash.com/photo-1613143525381-8051db3a30c8?auto=format&fit=crop&w=800&q=80",
    tags: ["spring", "blue", "perennial"]
  },
  {
    commonName: "White Orchid",
    scientificName: "Phalaenopsis",
    family: "Orchidaceae",
    description: "Elegant, long-lasting blooms often grown as indoor houseplants.",
    imageUrl: "https://images.unsplash.com/photo-1558000143-a60d32bb5eb8?auto=format&fit=crop&w=800&q=80",
    tags: ["indoor", "white", "elegant"]
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB, clearing old data...');
    await Flower.deleteMany({});
    
    console.log('Inserting new seed data...');
    await Flower.insertMany(seedData);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });