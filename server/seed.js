import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Flower from './models/Flower.js';

dotenv.config();

// We store the raw data concisely, then map it into the proper Schema format below
const rawFlowerData = [
  // --- ROSES (1-10) ---
  ["Juliet Rose", "Rosa 'Ausjameson'", "Rosaceae", "An exquisite, fully double peach rose with neatly arranged petals."],
  ["Black Magic Rose", "Rosa 'Black Magic'", "Rosaceae", "Deep, velvety dark red petals that appear almost black at the edges."],
  ["Avalanche Rose", "Rosa 'Avalanche'", "Rosaceae", "A gorgeous white rose with a hint of pale green on the outer guard petals."],
  ["Blue Moon Rose", "Rosa 'Blue Moon'", "Rosaceae", "A striking, silvery-lilac rose with a strong, sweet fragrance."],
  ["Darcey Rose", "Rosa 'Darcey'", "Rosaceae", "A rich magenta-crimson bloom that opens into a perfect rosette."],
  ["Peace Rose", "Rosa 'Peace'", "Rosaceae", "Large, classic blooms in a delicate blend of yellow and pink."],
  ["Mister Lincoln Rose", "Rosa 'Mister Lincoln'", "Rosaceae", "A classic, highly fragrant, velvety dark red hybrid tea rose."],
  ["Iceberg Rose", "Rosa 'Iceberg'", "Rosaceae", "Clusters of pure white, lightly scented, beautiful blooms."],
  ["Queen Elizabeth Rose", "Rosa 'Queen Elizabeth'", "Rosaceae", "Tall, elegant, silvery-pink blooms with a classic shape."],
  ["Double Delight Rose", "Rosa 'Double Delight'", "Rosaceae", "Stunning bi-color blooms of creamy white edged in strawberry red."],

  // --- PEONIES (11-20) ---
  ["Coral Charm Peony", "Paeonia lactiflora", "Paeoniaceae", "A stunning semi-double flower that changes color as it blooms."],
  ["Sarah Bernhardt Peony", "Paeonia lactiflora", "Paeoniaceae", "Enormous, classic double pink blooms with ruffled inner petals."],
  ["Festiva Maxima Peony", "Paeonia lactiflora", "Paeoniaceae", "Pure white double blooms with occasional flecks of crimson."],
  ["Buckeye Belle Peony", "Paeonia officinalis", "Paeoniaceae", "Deep, velvety maroon petals surrounding a contrasting golden center."],
  ["Bartzella Itoh Peony", "Paeonia 'Bartzella'", "Paeoniaceae", "Massive, brilliant yellow blossoms with a hint of red at the center."],
  ["Bowl of Beauty Peony", "Paeonia lactiflora", "Paeoniaceae", "Bright pink outer petals holding a center of frothy pale yellow."],
  ["Shirley Temple Peony", "Paeonia lactiflora", "Paeoniaceae", "Soft blush pink fading to a beautiful, pure ruffled white."],
  ["Karl Rosenfield Peony", "Paeonia lactiflora", "Paeoniaceae", "Brilliant, eye-catching crimson-red double blooms."],
  ["Duchesse de Nemours Peony", "Paeonia lactiflora", "Paeoniaceae", "Highly fragrant, globe-shaped creamy white flowers."],
  ["Pink Hawaiian Coral Peony", "Paeonia lactiflora", "Paeoniaceae", "Semi-double blooms in a vibrant shade of coral pink with a yellow center."],

  // --- LILIES & CALLAS (21-30) ---
  ["White Oriental Lily", "Lilium orientalis", "Liliaceae", "Massive, star-shaped pure white blooms with a sweet evening fragrance."],
  ["Stargazer Lily", "Lilium 'Stargazer'", "Liliaceae", "Bold pink and crimson petals edged in white, dotted with dark freckles."],
  ["Tiger Lily", "Lilium lancifolium", "Liliaceae", "Bright orange petals covered in dark, striking spots with prominent stamens."],
  ["Casablanca Lily", "Lilium 'Casa Blanca'", "Liliaceae", "Enormous, pure white, heavily fragrant outward-facing blooms."],
  ["Yellow Asiatic Lily", "Lilium asiatic", "Liliaceae", "Bright, upward-facing yellow blooms that bring instant cheer."],
  ["Elegant White Calla Lily", "Zantedeschia aethiopica", "Araceae", "A sweeping architectural petal wrapping around a golden spadix."],
  ["Odessa Plum Calla Lily", "Zantedeschia 'Odessa'", "Araceae", "A striking, almost black-purple variation of the classic smooth bloom."],
  ["Mango Calla Lily", "Zantedeschia 'Mango'", "Araceae", "Vibrant, sunset-orange blooms that fade into a warm golden yellow."],
  ["Picasso Calla Lily", "Zantedeschia 'Picasso'", "Araceae", "Striking bi-color blooms featuring a purple center edged in creamy white."],
  ["Garnet Glow Calla Lily", "Zantedeschia", "Araceae", "Intense, deep hot-pink blooms that add a pop of color to any arrangement."],

  // --- ORCHIDS (31-40) ---
  ["White Phalaenopsis Orchid", "Phalaenopsis amabilis", "Orchidaceae", "Graceful stems holding pristine white, moth-shaped blossoms."],
  ["Green Cymbidium Orchid", "Cymbidium", "Orchidaceae", "Stunning lime-green blooms with a contrasting speckled lip."],
  ["Vanda Blue Orchid", "Vanda coerulea", "Orchidaceae", "A rare, mesmerizing orchid showcasing vivid, naturally blue-violet petals."],
  ["Lady's Slipper Orchid", "Paphiopedilum", "Orchidaceae", "A highly unusual flower featuring a distinct pouch-shaped petal."],
  ["Dancing Lady Orchid", "Oncidium", "Orchidaceae", "A flurry of tiny, bright yellow flowers that resemble dancing figures."],
  ["Cattleya Orchid", "Cattleya labiata", "Orchidaceae", "Large, ruffled, highly fragrant blooms often used in classic corsages."],
  ["Miltonia Pansy Orchid", "Miltoniopsis", "Orchidaceae", "Striking, flat-faced blooms that heavily resemble garden pansies."],
  ["Dendrobium Nobile Orchid", "Dendrobium nobile", "Orchidaceae", "Clusters of delicate, colorful blooms growing closely along a bamboo-like cane."],
  ["Vanilla Orchid", "Vanilla planifolia", "Orchidaceae", "A rare vine orchid producing pale greenish-yellow flowers."],
  ["Spider Orchid", "Brassia", "Orchidaceae", "Unusual, long, spidery petals with striking green and brown markings."],

  // --- DAHLIAS (41-50) ---
  ["Burgundy Dahlia", "Dahlia pinnata", "Asteraceae", "Intricate, geometric blooms in a rich, moody burgundy."],
  ["Café au Lait Dahlia", "Dahlia 'Café au Lait'", "Asteraceae", "Dinnerplate-sized blooms in a creamy, dusty blush-beige tone."],
  ["Bishop of Llandaff Dahlia", "Dahlia 'Bishop of Llandaff'", "Asteraceae", "Vibrant scarlet red semi-double flowers set against dark foliage."],
  ["Pompon Dahlia", "Dahlia pompon", "Asteraceae", "Perfectly spherical, tightly rolled petals in a cheerful bright pink."],
  ["Labyrinth Dahlia", "Dahlia 'Labyrinth'", "Asteraceae", "Wild, twisting petals in swirling shades of peach and raspberry."],
  ["Peaches and Cream Dahlia", "Dahlia", "Asteraceae", "Spectacular blooms blending soft yellow, peach, and white tips."],
  ["Thomas Edison Dahlia", "Dahlia", "Asteraceae", "Massive, deep violet-purple dinnerplate blooms."],
  ["Kelvin Floodlight Dahlia", "Dahlia", "Asteraceae", "Incredible, huge, buttery yellow blooms that command attention."],
  ["Karma Choc Dahlia", "Dahlia", "Asteraceae", "Dark, velvety, almost black-red petals with a hint of chocolate fragrance."],
  ["Crazy Love Dahlia", "Dahlia", "Asteraceae", "White petals delicately edged with a soft, romantic lavender-pink."],

  // --- HYDRANGEAS & CARNATIONS (51-60) ---
  ["Blue Hydrangea", "Hydrangea macrophylla", "Hydrangeaceae", "Lush, globe-shaped clusters of vibrant blue petals."],
  ["White Hydrangea", "Hydrangea arborescens", "Hydrangeaceae", "Cloud-like clusters of pure white flowers, perfect for centerpieces."],
  ["Limelight Hydrangea", "Hydrangea paniculata", "Hydrangeaceae", "Cone-shaped panicles that emerge a soft chartreuse green."],
  ["Antique Pink Hydrangea", "Hydrangea macrophylla", "Hydrangeaceae", "Muted, dusty pink clusters with vintage appeal."],
  ["Purple Hydrangea", "Hydrangea macrophylla", "Hydrangeaceae", "Deep violet clusters shaped by the acidity of their soil."],
  ["Pink Carnation", "Dianthus caryophyllus", "Caryophyllaceae", "Ruffled, long-lasting pink blooms symbolizing gratitude."],
  ["White Carnation", "Dianthus caryophyllus", "Caryophyllaceae", "Pure white, ruffled petals with a spicy, clove-like fragrance."],
  ["Red Carnation", "Dianthus caryophyllus", "Caryophyllaceae", "Deep red, classic ruffled blooms often used in romantic bouquets."],
  ["Peach Carnation", "Dianthus caryophyllus", "Caryophyllaceae", "A vintage, dusty peach tone with heavily textured layers."],
  ["Green Trick Dianthus", "Dianthus barbatus", "Caryophyllaceae", "A unique, spherical, fuzzy green bloom with no actual petals."],

  // --- TULIPS (61-70) ---
  ["Purple Tulip", "Tulipa gesneriana", "Liliaceae", "Elegant, cup-shaped spring blooms in a deep, majestic purple."],
  ["Parrot Tulip", "Tulipa 'Parrot'", "Liliaceae", "Heavily ruffled, feathered edges with striking bicolored streaks."],
  ["Queen of Night Tulip", "Tulipa 'Queen of Night'", "Liliaceae", "A dramatic, late-spring tulip so dark purple it appears almost black."],
  ["Fringed White Tulip", "Tulipa crispa", "Liliaceae", "Pure white petals edged with delicate, crystalline fringes."],
  ["Angelique Tulip", "Tulipa 'Angelique'", "Liliaceae", "Soft pink, double-layered petals that closely resemble a peony."],
  ["Yellow Darwin Hybrid Tulip", "Tulipa", "Liliaceae", "Classic, strong-stemmed, massive golden yellow blooms."],
  ["Red Emperor Tulip", "Tulipa fosteriana", "Liliaceae", "Huge, brilliant red petals opening wide in the spring sun."],
  ["Shirley Tulip", "Tulipa", "Liliaceae", "Ivory white petals that slowly develop a soft purple edge as they mature."],
  ["Princess Irene Tulip", "Tulipa", "Liliaceae", "Vibrant orange petals flamed with striking purple markings."],
  ["Ice Cream Tulip", "Tulipa", "Liliaceae", "A unique double tulip resembling a scoop of vanilla ice cream in a pink cone."],

  // --- RANUNCULUS & ANEMONES (71-80) ---
  ["Pink Ranunculus", "Ranunculus asiaticus", "Ranunculaceae", "Endless layers of tissue-thin, delicate pink petals."],
  ["White Ranunculus", "Ranunculus asiaticus", "Ranunculaceae", "Pure white, tightly wrapped petals forming a perfect rosette."],
  ["Burgundy Ranunculus", "Ranunculus asiaticus", "Ranunculaceae", "Deep, moody wine-red layers perfect for dramatic styling."],
  ["Orange Ranunculus", "Ranunculus asiaticus", "Ranunculaceae", "Vibrant, citrus-orange layers packed tightly into a rosette."],
  ["Butterfly Ranunculus", "Ranunculus 'Butterfly'", "Ranunculaceae", "Shimmering, wax-like single petals in a soft, sunny yellow."],
  ["White Anemone", "Anemone coronaria", "Ranunculaceae", "Striking white petals contrasted by a velvety dark center."],
  ["Bordeaux Anemone", "Anemone coronaria", "Ranunculaceae", "Deep wine-red petals surrounding a signature dark core."],
  ["Blue Anemone", "Anemone coronaria", "Ranunculaceae", "Vibrant, almost ultraviolet blue petals with a dark center."],
  ["Pink Anemone", "Anemone hupehensis", "Ranunculaceae", "Delicate, dancing pink petals commonly known as the Japanese Anemone."],
  ["Double White Anemone", "Anemone coronaria", "Ranunculaceae", "Multiple layers of ruffled white petals giving a fuller, textured look."],

  // --- DAISIES, SUNFLOWERS, CHRYSANTHEMUMS (81-90) ---
  ["Golden Sunflower", "Helianthus annuus", "Asteraceae", "Massive, bright yellow blooms with a large, dark seeded center."],
  ["Teddy Bear Sunflower", "Helianthus annuus", "Asteraceae", "A fluffy, fully double sunflower resembling a golden plush toy."],
  ["White Shasta Daisy", "Leucanthemum x superbum", "Asteraceae", "Classic white petals surrounding a bright yellow center."],
  ["Pink Gerbera Daisy", "Gerbera jamesonii", "Asteraceae", "Large, cheerful, intensely bright pink blooms on leafless stems."],
  ["Orange Gerbera Daisy", "Gerbera jamesonii", "Asteraceae", "Vibrant, neon-orange petals offering a perfect burst of color."],
  ["White Spider Mums", "Chrysanthemum morifolium", "Asteraceae", "Long, tubular, spidery white petals cascading outward."],
  ["Bronze Cushion Mum", "Chrysanthemum", "Asteraceae", "A tight, rounded bloom packed with deep bronze-orange petals."],
  ["Green Button Poms", "Chrysanthemum", "Asteraceae", "Small, bright green, spherical blooms perfect for filling arrangements."],
  ["Pink Aster", "Symphyotrichum", "Asteraceae", "Tiny, star-like pink blooms with yellow centers that bloom in late fall."],
  ["Purple Echinacea", "Echinacea purpurea", "Asteraceae", "Drooping purple petals surrounding a prominent, spiky copper cone."],

  // --- WILDFLOWERS, FILLERS & EXOTICS (91-100) ---
  ["Blue Delphinium", "Delphinium elatum", "Ranunculaceae", "Tall, dramatic spires completely covered in true-blue flowers."],
  ["Lavender Sweet Pea", "Lathyrus odoratus", "Fabaceae", "Delicate, ruffled blossoms with an incredibly romantic fragrance."],
  ["White Scabiosa", "Scabiosa caucasica", "Caprifoliaceae", "A delicate pincushion flower in pure white, offering great texture."],
  ["Black Knight Scabiosa", "Scabiosa atropurpurea", "Caprifoliaceae", "Pincushion-like blooms in an intensely dark, maroon-black color."],
  ["Yellow Freesia", "Freesia corymbosa", "Iridaceae", "Arching stems lined with vibrant yellow, trumpet-shaped blossoms."],
  ["White Baby's Breath", "Gypsophila paniculata", "Caryophyllaceae", "Clouds of tiny, delicate white blooms used as the ultimate filler."],
  ["Blue Thistle", "Eryngium", "Apiaceae", "Spiky, metallic blue blooms that add architectural edge."],
  ["King Protea", "Protea cynaroides", "Proteaceae", "A massive flower with a fuzzy crown of pink and white bracts."],
  ["Blushing Bride Protea", "Serruria florida", "Proteaceae", "Delicate, pointed ivory petals blushing with soft pink."],
  ["Orange Bird of Paradise", "Strelitzia reginae", "Strelitziaceae", "Striking orange and blue petals resembling a tropical bird in flight."]
];

const finalFlowerCollection = rawFlowerData.map(flower => ({
  commonName: flower[0],
  scientificName: flower[1],
  family: flower[2],
  description: flower[3],
  imageUrl: "/heroimage.jpg", // THE UNIVERSAL PLACEHOLDER
  tags: ["catalogue", flower[2].toLowerCase()]
}));

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    
    await Flower.deleteMany({});
    console.log("Cleared old database...");
    
    await Flower.insertMany(finalFlowerCollection);
    console.log(`Success! Seeded EXACTLY ${finalFlowerCollection.length} flowers using the hero image placeholder!`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();