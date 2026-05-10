import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Flower from './models/Flower.js';

dotenv.config();

const floristMasterCollection = [
  {
    commonName: "Coral Charm Peony",
    scientificName: "Paeonia lactiflora",
    family: "Paeoniaceae",
    description: "A stunning semi-double flower that changes color as it blooms, starting as deep coral and fading to an elegant cream.",
    imageUrl: "https://images.unsplash.com/photo-1582791694776-0818274d8123?q=80&w=800",
    tags: ["spring", "coral", "premium"]
  },
  {
    commonName: "White Oriental Lily",
    scientificName: "Lilium orientalis",
    family: "Liliaceae",
    description: "Known for their massive, star-shaped pure white blooms and an intoxicatingly sweet evening fragrance.",
    imageUrl: "https://images.unsplash.com/photo-1596767098522-3855ebc08791?q=80&w=800",
    tags: ["white", "fragrant", "classic"]
  },
  {
    commonName: "Blue Hydrangea",
    scientificName: "Hydrangea macrophylla",
    family: "Hydrangeaceae",
    description: "Lush, globe-shaped clusters of vibrant blue petals that bring a dramatic, romantic feel to any arrangement.",
    imageUrl: "https://images.unsplash.com/photo-1623065660851-1b033e6da80f?q=80&w=800",
    tags: ["blue", "summer", "volume"]
  },
  {
    commonName: "Juliet Rose",
    scientificName: "Rosa 'Ausjameson'",
    family: "Rosaceae",
    description: "An exquisite, fully double peach rose with neatly arranged petals nestled in the heart of the bloom.",
    imageUrl: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=800",
    tags: ["peach", "wedding", "luxury"]
  },
  {
    commonName: "Purple Tulip",
    scientificName: "Tulipa gesneriana",
    family: "Liliaceae",
    description: "Elegant, cup-shaped spring blooms in a deep, majestic purple. Perfect for modern, clean arrangements.",
    imageUrl: "https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=800",
    tags: ["purple", "spring", "minimalist"]
  },
  {
    commonName: "Pink Ranunculus",
    scientificName: "Ranunculus asiaticus",
    family: "Ranunculaceae",
    description: "Often called the 'rose of the spring', featuring endless layers of tissue-thin, delicate pink petals.",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-8f525c6ca331?q=80&w=800",
    tags: ["pink", "delicate", "trendy"]
  },
  {
    commonName: "White Anemone",
    scientificName: "Anemone coronaria",
    family: "Ranunculaceae",
    description: "Striking white petals contrasted by a dramatic, velvety dark center. A favorite for striking, high-contrast bouquets.",
    imageUrl: "https://images.unsplash.com/photo-1611077544837-124b89e13e00?q=80&w=800",
    tags: ["white", "striking", "black-center"]
  },
  {
    commonName: "Burgundy Dahlia",
    scientificName: "Dahlia pinnata",
    family: "Asteraceae",
    description: "Intricate, geometric blooms in a rich, moody burgundy. Brings incredible texture to autumn arrangements.",
    imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800",
    tags: ["burgundy", "autumn", "textured"]
  },
  {
    commonName: "Yellow Freesia",
    scientificName: "Freesia corymbosa",
    family: "Iridaceae",
    description: "Graceful, arching stems lined with vibrant yellow, trumpet-shaped blossoms that carry a light, citrusy scent.",
    imageUrl: "https://images.unsplash.com/photo-1591886803204-58e11a31d9ec?q=80&w=800",
    tags: ["yellow", "scented", "bright"]
  },
  {
    commonName: "Blue Delphinium",
    scientificName: "Delphinium elatum",
    family: "Ranunculaceae",
    description: "Tall, dramatic spires completely covered in true-blue, star-shaped flowers. Excellent for adding height to displays.",
    imageUrl: "https://images.unsplash.com/photo-1628148906969-a9a7a67f1857?q=80&w=800",
    tags: ["blue", "tall", "dramatic"]
  }
];

const seedFloristDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Clear the old botanical data
    await Flower.deleteMany({});
    console.log("Cleared old database...");

    // Insert the luxury florist collection
    await Flower.insertMany(floristMasterCollection);
    console.log(`Success! Seeded ${floristMasterCollection.length} premium florist flowers!`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedFloristDatabase();