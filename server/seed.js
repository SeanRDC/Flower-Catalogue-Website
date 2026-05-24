import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Flower from './models/Flower.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const imageDictionary = {
  // ROSES
  "Juliet Rose": "https://images.pexels.com/photos/7252509/pexels-photo-7252509.jpeg",
  "Black Magic Rose": "https://images.pexels.com/photos/1020494/pexels-photo-1020494.jpeg",
  "Golden Sunflower": "https://images.unsplash.com/photo-1632484939225-31d800aedfb2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Blue Hydrangea": "https://images.unsplash.com/photo-1530447416112-3cc6b05008e8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Avalanche Rose": "https://images.pexels.com/photos/35013384/pexels-photo-35013384.jpeg",
  "Blue Moon Rose": "https://images.pexels.com/photos/11234764/pexels-photo-11234764.jpeg",
  "Darcey Rose": "https://images.pexels.com/photos/34374629/pexels-photo-34374629.jpeg", 
  "Peace Rose": "https://images.pexels.com/photos/12177348/pexels-photo-12177348.jpeg",
  "Mister Lincoln Rose": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Rosa_%27Mister_Lincoln%27_1964.jpg/960px-Rosa_%27Mister_Lincoln%27_1964.jpg",
  "Iceberg Rose": "https://images.pexels.com/photos/35774175/pexels-photo-35774175.jpeg",
  "Queen Elizabeth Rose": "https://images.pexels.com/photos/4840738/pexels-photo-4840738.jpeg",
  "Double Delight Rose": "https://images.pexels.com/photos/12268701/pexels-photo-12268701.jpeg",

  // PEONIES
  "Coral Charm Peony": "https://images.pexels.com/photos/8192941/pexels-photo-8192941.jpeg",
  "Sarah Bernhardt Peony": "https://images.pexels.com/photos/12507420/pexels-photo-12507420.jpeg",
  "Festiva Maxima Peony": "https://images.pexels.com/photos/37712002/pexels-photo-37712002.jpeg",
  "Buckeye Belle Peony": "https://images.pexels.com/photos/12522008/pexels-photo-12522008.jpeg",
  "Bartzella Itoh Peony": "https://images.pexels.com/photos/8637284/pexels-photo-8637284.jpeg",
  "Bowl of Beauty Peony":"https://www.gardenia.net/wp-content/uploads/2023/05/paeonia-bartzella-itoh-peony-780x520.webp",
  "Shirley Temple Peony": "https://images.pexels.com/photos/37712002/pexels-photo-37712002.jpeg",
  "Karl Rosenfield Peony": "https://images.pexels.com/photos/6974504/pexels-photo-6974504.jpeg",
  "Duchesse de Nemours Peony": "https://images.pexels.com/photos/9304812/pexels-photo-9304812.jpeg",
  "Pink Hawaiian Coral Peony": "https://images.pexels.com/photos/12000146/pexels-photo-12000146.jpeg",

  // LILIES AND CALLAS
  "White Oriental Lily": "https://images.unsplash.com/photo-1652892342350-f907023f2406?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "Stargazer Lily": "https://images.pexels.com/photos/9985918/pexels-photo-9985918.jpeg",
  "Tiger Lily": "https://images.pexels.com/photos/5009411/pexels-photo-5009411.jpeg",
  "Casablanca Lily": "https://images.pexels.com/photos/36164853/pexels-photo-36164853.jpeg",
  "Yellow Asiatic Lily": "https://images.pexels.com/photos/7676446/pexels-photo-7676446.jpeg",
  "Elegant White Calla Lily": "https://images.pexels.com/photos/7471281/pexels-photo-7471281.jpeg",
  "Odessa Plum Calla Lily": "https://images.pexels.com/photos/9190705/pexels-photo-9190705.jpeg",
  "Mango Calla Lily": "https://images.pexels.com/photos/28314293/pexels-photo-28314293.jpeg",
  "Picasso Calla Lily": "https://www.gardenia.net/wp-content/uploads/2023/05/zantedeschia-picasso-calla-lily.webp",
  "Garnet Glow Calla Lily": "https://search.shelmerdine.com/Content/Images/Photos/F675-14.jpg",

  // ORCHIDS
  "White Phalaenopsis Orchid": "https://images.pexels.com/photos/18378607/pexels-photo-18378607.jpeg",
  "Green Cymbidium Orchid":"https://images.pexels.com/photos/7367456/pexels-photo-7367456.jpeg",
  "Vanda Blue Orchid": "https://images.pexels.com/photos/20598151/pexels-photo-20598151.jpeg",
  "Lady's Slipper Orchid": "https://images.pexels.com/photos/30313201/pexels-photo-30313201.jpeg",
  "Dancing Lady Orchid": "https://images.pexels.com/photos/5775201/pexels-photo-5775201.jpeg",
  "Cattleya Orchid": "https://images.pexels.com/photos/8280971/pexels-photo-8280971.jpeg",
  "Miltonia Pansy Orchid": "https://www.thespruce.com/thmb/dvxZovCRR73sfV61gyRuIz9hGJw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/miltonia-orchid-care-guide-5221547-hero-0512dc809f994a7893957b184da70e21.jpg",
  "Dendrobium Nobile Orchid": "https://images.pexels.com/photos/11392291/pexels-photo-11392291.jpeg",
  "Vanilla Orchid": "https://d384u2mq2suvbq.cloudfront.net/public/spree/products/6127/large/vanilla-orchid-web.webp",
  "Spider Orchid": "https://images.pexels.com/photos/36715884/pexels-photo-36715884.jpeg",

  //DAHLIAS
  "Burgundy Dahlia": "",
  "Café au Lait Dahlia": "",
  "Bishop of Llandaff Dahlia": "",
  "Pompon Dahlia": "",
  "Labyrinth Dahlia": "",
  "Peaches and Cream Dahlia": "",
  "Thomas Edison Dahlia": "",
  "Kelvin Floodlight Dahlia": "",
  "Karma Choc Dahlia": "",
  "Crazy Love Dahlia": "",

  // --- HYDRANGEAS & CARNATIONS (51-60) ---
  "Blue Hydrangea": "",
  "White Hydrangea": "",
  "Limelight Hydrangea": "",
  "Antique Pink Hydrangea": "",
  "Purple Hydrangea": "",
  "Pink Carnation": "",
  "White Carnation": "",
  "Red Carnation": "",
  "Peach Carnation": "",
  "Green Trick Dianthus": "",

  // --- TULIPS (61-70) ---
  "Purple Tulip": "",
  "Parrot Tulip": "",
  "Queen of Night Tulip": "",
  "Fringed White Tulip": "",
  "Angelique Tulip": "",
  "Yellow Darwin Hybrid Tulip": "",
  "Red Emperor Tulip": "",
  "Shirley Tulip": "",
  "Princess Irene Tulip": "",
  "Ice Cream Tulip": "",

  // --- RANUNCULUS & ANEMONES (71-80) ---
  "Pink Ranunculus": "",
  "White Ranunculus": "",
  "Burgundy Ranunculus": "",
  "Orange Ranunculus": "",
  "Butterfly Ranunculus": "",
  "White Anemone": "",
  "Bordeaux Anemone": "",
  "Blue Anemone": "",
  "Pink Anemone": "",
  "Double White Anemone": "",

  // --- DAISIES, SUNFLOWERS, CHRYSANTHEMUMS (81-90) ---
  "Golden Sunflower": "",
  "Teddy Bear Sunflower": "",
  "White Shasta Daisy": "",
  "Pink Gerbera Daisy": "",
  "Orange Gerbera Daisy": "",
  "White Spider Mums": "",
  "Bronze Cushion Mum": "",
  "Green Button Poms": "",
  "Pink Aster": "",
  "Purple Echinacea": "",

  // --- WILDFLOWERS, FILLERS & EXOTICS (91-100) ---
  "Blue Delphinium": "",
  "Lavender Sweet Pea": "",
  "White Scabiosa": "",
  "Black Knight Scabiosa": "",
  "Yellow Freesia": "",
  "White Baby's Breath": "",
  "Blue Thistle": "",
  "King Protea": "",
  "Blushing Bride Protea": "",
  "Orange Bird of Paradise": "",

  // --- IRISES & GLADIOLUS (101-110) ---
  "Bearded Iris": "",
  "Siberian Iris": "",
  "Dutch Iris": "",
  "Japanese Iris": "",
  "Black Iris": "",
  "Red Gladiolus": "",
  "Green Star Gladiolus": "",
  "Blue Isle Gladiolus": "",
  "Plum Tart Gladiolus": "",
  "White Prosperity Gladiolus": "",

  // --- ZINNIAS & MARIGOLDS (111-120) ---
  "California Giant Zinnia": "",
  "Queen Red Lime Zinnia": "",
  "Thumbelina Zinnia": "",
  "Zahara Double Fire Zinnia": "",
  "Peppermint Stick Zinnia": "",
  "African Marigold": "",
  "French Marigold": "",
  "Signet Marigold": "",
  "Vanilla Marigold": "",
  "Strawberry Blonde Marigold": "",

  // --- COSMOS & POPPIES (121-130) ---
  "Sensation Pink Cosmos": "",
  "Chocolate Cosmos": "",
  "Seashells Cosmos": "",
  "Sulphur Orange Cosmos": "",
  "Purity White Cosmos": "",
  "Oriental Poppy": "",
  "California Poppy": "",
  "Iceland Poppy": "",
  "Shirley Poppy": "",
  "Himalayan Blue Poppy": "",

  // --- SNAPDRAGONS, FOXGLOVES & HOLLYHOCKS (131-140) ---
  "Rocket Snapdragon": "",
  "Black Prince Snapdragon": "",
  "Madame Butterfly Snapdragon": "",
  "Common Foxglove": "",
  "Camelot White Foxglove": "",
  "Peach Foxglove": "",
  "Black Watchman Hollyhock": "",
  "Chaters Double Pink Hollyhock": "",
  "Halo Apricot Hollyhock": "",
  "Yellow Hollyhock": "",

  // --- HIBISCUS & TROPICALS (141-150) ---
  "Luna Red Hibiscus": "",
  "Tropical Yellow Hibiscus": "",
  "Blue Chiffon Rose of Sharon": "",
  "Pink Chandelier Medinilla": "",
  "Red Anthurium": "",
  "White Ginger Lily": "",
  "Pink Frangipani": "",
  "Yellow Allamanda": "",
  "Red Heliconia": "",
  "Orange Bougainvillea": "",

  // --- SPRING BULBS (151-160) ---
  "King Alfred Daffodil": "",
  "Thalia Daffodil": "",
  "Tahiti Double Daffodil": "",
  "Blue Jacket Hyacinth": "",
  "Pink Pearl Hyacinth": "",
  "Purple Sensation Allium": "",
  "Globemaster Allium": "",
  "Giant Crocus": "",
  "Yellow Mammoth Crocus": "",
  "Snake's Head Fritillary": "",

  // --- BEGONIAS, PETUNIAS & IMPATIENS (161-170) ---
  "Nonstop Red Begonia": "",
  "Dragon Wing Pink Begonia": "",
  "Night Sky Petunia": "",
  "Wave Carmine Velour Petunia": "",
  "Black Mamba Petunia": "",
  "Superbells Lemon Calibrachoa": "",
  "Divine Orange New Guinea Impatiens": "",
  "Rockapulco White Impatiens": "",
  "Beacon Violet Impatiens": "",
  "SunPatiens Blush Pink": "",

  // --- PANSIES, VIOLAS & ALYSSUM (171-180) ---
  "Matrix Blue True Pansy": "",
  "Delta Fire Pansy": "",
  "Black Accord Pansy": "",
  "Sorbet Lemon Blueberry Viola": "",
  "Tiger Eye Viola": "",
  "Sweet Violet": "",
  "Snow Crystals Sweet Alyssum": "",
  "Royal Carpet Alyssum": "",
  "Clear Crystal Apricot Alyssum": "",
  "Trailing Lobelia": "",

  // --- CLIMBERS & VINES (181-190) ---
  "Jackmanii Clematis": "",
  "Nelly Moser Clematis": "",
  "Heavenly Blue Morning Glory": "",
  "Moonflower": "",
  "Black Eyed Susan Vine": "",
  "Purple Wisteria": "",
  "White Wisteria": "",
  "Climbing Iceberg Rose": "",
  "Mandevilla Alice Dupont": "",
  "Passionflower": "",

  // --- UNIQUE, WILD & WOODLAND (191-200) ---
  "Pink Bleeding Heart": "",
  "White Bleeding Heart": "",
  "Origami Red Columbine": "",
  "Rocky Mountain Columbine": "",
  "Gallery Blue Lupin": "",
  "Russell Mix Lupin": "",
  "Paprika Yarrow": "",
  "Moonshine Yarrow": "",
  "Miss Huff Lantana": "",
  "Purple Verbena": ""
};

const extractTruthfulData = (name, family, description) => {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();
  const lowerFamily = family.toLowerCase();

  let color = "White";
  let petalShape = "Rounded";
  let type = "Other";
  let symbolism = "Joy";
  
  if (lowerDesc.includes("red") || lowerName.includes("red") || lowerDesc.includes("crimson") || lowerDesc.includes("burgundy") || lowerDesc.includes("scarlet") || lowerDesc.includes("mahogany")) color = "Red";
  else if (lowerDesc.includes("pink") || lowerName.includes("pink") || lowerDesc.includes("magenta") || lowerDesc.includes("blush") || lowerDesc.includes("rose ") || lowerDesc.includes("fuchsia") || lowerDesc.includes("coral")) color = "Pink";
  else if (lowerDesc.includes("yellow") || lowerName.includes("yellow") || lowerDesc.includes("gold") || lowerDesc.includes("lemon")) color = "Yellow";
  else if (lowerDesc.includes("purple") || lowerName.includes("purple") || lowerDesc.includes("violet") || lowerDesc.includes("lilac") || lowerDesc.includes("lavender") || lowerDesc.includes("plum") || lowerName.includes("black")) color = "Purple";
  else if (lowerDesc.includes("blue") || lowerName.includes("blue") || lowerDesc.includes("sky")) color = "Blue";
  else if (lowerDesc.includes("orange") || lowerName.includes("orange") || lowerDesc.includes("peach") || lowerDesc.includes("apricot") || lowerDesc.includes("copper")) color = "Orange";
  else if (lowerDesc.includes("green") || lowerName.includes("green") || lowerDesc.includes("chartreuse") || lowerDesc.includes("lime")) color = "Green";
  else if (lowerDesc.includes("white") || lowerName.includes("white") || lowerDesc.includes("ivory") || lowerDesc.includes("cream")) color = "White";

  if (lowerName.includes("rose") || lowerName.includes("peony") || lowerName.includes("carnation") || lowerName.includes("ranunculus") || lowerName.includes("parrot") || lowerDesc.includes("ruffled") || lowerDesc.includes("double") || lowerDesc.includes("tissue")) {
    petalShape = "Ruffled";
  } else if (lowerName.includes("lily") || lowerName.includes("tulip") || lowerDesc.includes("pointed") || lowerDesc.includes("star") || lowerDesc.includes("trumpet") || lowerDesc.includes("spire")) {
    petalShape = "Pointed";
  } else if (lowerName.includes("orchid") || lowerName.includes("spider") || lowerName.includes("thistle") || lowerDesc.includes("spidery") || lowerFamily.includes("proteaceae")) {
    petalShape = "Spider-like";
  } else {
    petalShape = "Rounded";
  }

  if (lowerName.includes("rose") || lowerFamily.includes("rosaceae")) type = "Rose";
  else if (lowerName.includes("lily") || lowerFamily.includes("liliaceae") || lowerFamily.includes("araceae")) type = "Lily";
  else if (lowerName.includes("tulip")) type = "Tulip";
  else if (lowerName.includes("orchid") || lowerFamily.includes("orchidaceae")) type = "Orchid";
  else if (lowerName.includes("daisy") || lowerName.includes("sunflower") || lowerFamily.includes("asteraceae")) type = "Daisy";
  else if (lowerName.includes("peony") || lowerFamily.includes("paeoniaceae")) type = "Peony";
  else if (lowerName.includes("carnation") || lowerFamily.includes("caryophyllaceae")) type = "Carnation";
  else type = "Other";

  if (type === "Rose" || color === "Red" || lowerName.includes("romantic")) symbolism = "Love";
  else if (color === "White" || type === "Lily") symbolism = "Purity";
  else if (color === "Yellow" || type === "Daisy" || lowerName.includes("sunflower")) symbolism = "Joy";
  else if (type === "Orchid" || lowerName.includes("gladiolus") || lowerDesc.includes("sturdy")) symbolism = "Strength";
  else if (color === "Blue" || color === "Purple") symbolism = "Peace";
  else symbolism = "Friendship";

  const imageUrl = imageDictionary[name] || "/heroimage.jpg";

  return { color, petalShape, type, symbolism, imageUrl };
};

const rawFlowerData = [
  // --- ROSES (1-10) ---
  ["Juliet Rose", "Rosa 'Ausjameson'", "Rosaceae", "An exquisite, fully double peach rose with neatly arranged petals.", "Perennial"],
  ["Black Magic Rose", "Rosa 'Black Magic'", "Rosaceae", "Deep, velvety dark red petals that appear almost black at the edges.", "Perennial"],
  ["Avalanche Rose", "Rosa 'Avalanche'", "Rosaceae", "A gorgeous white rose with a hint of pale green on the outer guard petals.", "Perennial"],
  ["Blue Moon Rose", "Rosa 'Blue Moon'", "Rosaceae", "A striking, silvery-lilac rose with a strong, sweet fragrance.", "Perennial"],
  ["Darcey Rose", "Rosa 'Darcey'", "Rosaceae", "A rich magenta-crimson bloom that opens into a perfect rosette.", "Perennial"],
  ["Peace Rose", "Rosa 'Peace'", "Rosaceae", "Large, classic blooms in a delicate blend of yellow and pink.", "Perennial"],
  ["Mister Lincoln Rose", "Rosa 'Mister Lincoln'", "Rosaceae", "A classic, highly fragrant, velvety dark red hybrid tea rose.", "Perennial"],
  ["Iceberg Rose", "Rosa 'Iceberg'", "Rosaceae", "Clusters of pure white, lightly scented, beautiful blooms.", "Perennial"],
  ["Queen Elizabeth Rose", "Rosa 'Queen Elizabeth'", "Rosaceae", "Tall, elegant, silvery-pink blooms with a classic shape.", "Perennial"],
  ["Double Delight Rose", "Rosa 'Double Delight'", "Rosaceae", "Stunning bi-color blooms of creamy white edged in strawberry red.", "Perennial"],

  // --- PEONIES (11-20) ---
  ["Coral Charm Peony", "Paeonia lactiflora", "Paeoniaceae", "A stunning semi-double flower that changes color as it blooms.", "Perennial"],
  ["Sarah Bernhardt Peony", "Paeonia lactiflora", "Paeoniaceae", "Enormous, classic double pink blooms with ruffled inner petals.", "Perennial"],
  ["Festiva Maxima Peony", "Paeonia lactiflora", "Paeoniaceae", "Pure white double blooms with occasional flecks of crimson.", "Perennial"],
  ["Buckeye Belle Peony", "Paeonia officinalis", "Paeoniaceae", "Deep, velvety maroon petals surrounding a contrasting golden center.", "Perennial"],
  ["Bartzella Itoh Peony", "Paeonia 'Bartzella'", "Paeoniaceae", "Massive, brilliant yellow blossoms with a hint of red at the center.", "Perennial"],
  ["Bowl of Beauty Peony", "Paeonia lactiflora", "Paeoniaceae", "Bright pink outer petals holding a center of frothy pale yellow.", "Perennial"],
  ["Shirley Temple Peony", "Paeonia lactiflora", "Paeoniaceae", "Soft blush pink fading to a beautiful, pure ruffled white.", "Perennial"],
  ["Karl Rosenfield Peony", "Paeonia lactiflora", "Paeoniaceae", "Brilliant, eye-catching crimson-red double blooms.", "Perennial"],
  ["Duchesse de Nemours Peony", "Paeonia lactiflora", "Paeoniaceae", "Highly fragrant, globe-shaped creamy white flowers.", "Perennial"],
  ["Pink Hawaiian Coral Peony", "Paeonia lactiflora", "Paeoniaceae", "Semi-double blooms in a vibrant shade of coral pink with a yellow center.", "Perennial"],

  // --- LILIES & CALLAS (21-30) ---
  ["White Oriental Lily", "Lilium orientalis", "Liliaceae", "Massive, star-shaped pure white blooms with a sweet evening fragrance.", "Perennial"],
  ["Stargazer Lily", "Lilium 'Stargazer'", "Liliaceae", "Bold pink and crimson petals edged in white, dotted with dark freckles.", "Perennial"],
  ["Tiger Lily", "Lilium lancifolium", "Liliaceae", "Bright orange petals covered in dark, striking spots with prominent stamens.", "Perennial"],
  ["Casablanca Lily", "Lilium 'Casa Blanca'", "Liliaceae", "Enormous, pure white, heavily fragrant outward-facing blooms.", "Perennial"],
  ["Yellow Asiatic Lily", "Lilium asiatic", "Liliaceae", "Bright, upward-facing yellow blooms that bring instant cheer.", "Perennial"],
  ["Elegant White Calla Lily", "Zantedeschia aethiopica", "Araceae", "A sweeping architectural petal wrapping around a golden spadix.", "Perennial"],
  ["Odessa Plum Calla Lily", "Zantedeschia 'Odessa'", "Araceae", "A striking, almost black-purple variation of the classic smooth bloom.", "Perennial"],
  ["Mango Calla Lily", "Zantedeschia 'Mango'", "Araceae", "Vibrant, sunset-orange blooms that fade into a warm golden yellow.", "Perennial"],
  ["Picasso Calla Lily", "Zantedeschia 'Picasso'", "Araceae", "Striking bi-color blooms featuring a purple center edged in creamy white.", "Perennial"],
  ["Garnet Glow Calla Lily", "Zantedeschia", "Araceae", "Intense, deep hot-pink blooms that add a pop of color to any arrangement.", "Perennial"],

  // --- ORCHIDS (31-40) ---
  ["White Phalaenopsis Orchid", "Phalaenopsis amabilis", "Orchidaceae", "Graceful stems holding pristine white, moth-shaped blossoms.", "Perennial"],
  ["Green Cymbidium Orchid", "Cymbidium", "Orchidaceae", "Stunning lime-green blooms with a contrasting speckled lip.", "Perennial"],
  ["Vanda Blue Orchid", "Vanda coerulea", "Orchidaceae", "A rare, mesmerizing orchid showcasing vivid, naturally blue-violet petals.", "Perennial"],
  ["Lady's Slipper Orchid", "Paphiopedilum", "Orchidaceae", "A highly unusual flower featuring a distinct pouch-shaped petal.", "Perennial"],
  ["Dancing Lady Orchid", "Oncidium", "Orchidaceae", "A flurry of tiny, bright yellow flowers that resemble dancing figures.", "Perennial"],
  ["Cattleya Orchid", "Cattleya labiata", "Orchidaceae", "Large, ruffled, highly fragrant blooms often used in classic corsages.", "Perennial"],
  ["Miltonia Pansy Orchid", "Miltoniopsis", "Orchidaceae", "Striking, flat-faced blooms that heavily resemble garden pansies.", "Perennial"],
  ["Dendrobium Nobile Orchid", "Dendrobium nobile", "Orchidaceae", "Clusters of delicate, colorful blooms growing closely along a bamboo-like cane.", "Perennial"],
  ["Vanilla Orchid", "Vanilla planifolia", "Orchidaceae", "A rare vine orchid producing pale greenish-yellow flowers.", "Perennial"],
  ["Spider Orchid", "Brassia", "Orchidaceae", "Unusual, long, spidery petals with striking green and brown markings.", "Perennial"],

  // --- DAHLIAS (41-50) ---
  ["Burgundy Dahlia", "Dahlia pinnata", "Asteraceae", "Intricate, geometric blooms in a rich, moody burgundy.", "Perennial"],
  ["Café au Lait Dahlia", "Dahlia 'Café au Lait'", "Asteraceae", "Dinnerplate-sized blooms in a creamy, dusty blush-beige tone.", "Perennial"],
  ["Bishop of Llandaff Dahlia", "Dahlia 'Bishop of Llandaff'", "Asteraceae", "Vibrant scarlet red semi-double flowers set against dark foliage.", "Perennial"],
  ["Pompon Dahlia", "Dahlia pompon", "Asteraceae", "Perfectly spherical, tightly rolled petals in a cheerful bright pink.", "Perennial"],
  ["Labyrinth Dahlia", "Dahlia 'Labyrinth'", "Asteraceae", "Wild, twisting petals in swirling shades of peach and raspberry.", "Perennial"],
  ["Peaches and Cream Dahlia", "Dahlia", "Asteraceae", "Spectacular blooms blending soft yellow, peach, and white tips.", "Perennial"],
  ["Thomas Edison Dahlia", "Dahlia", "Asteraceae", "Massive, deep violet-purple dinnerplate blooms.", "Perennial"],
  ["Kelvin Floodlight Dahlia", "Dahlia", "Asteraceae", "Incredible, huge, buttery yellow blooms that command attention.", "Perennial"],
  ["Karma Choc Dahlia", "Dahlia", "Asteraceae", "Dark, velvety, almost black-red petals with a hint of chocolate fragrance.", "Perennial"],
  ["Crazy Love Dahlia", "Dahlia", "Asteraceae", "White petals delicately edged with a soft, romantic lavender-pink.", "Perennial"],

  // --- HYDRANGEAS & CARNATIONS (51-60) ---
  ["Blue Hydrangea", "Hydrangea macrophylla", "Hydrangeaceae", "Lush, globe-shaped clusters of vibrant blue petals.", "Perennial"],
  ["White Hydrangea", "Hydrangea arborescens", "Hydrangeaceae", "Cloud-like clusters of pure white flowers, perfect for centerpieces.", "Perennial"],
  ["Limelight Hydrangea", "Hydrangea paniculata", "Hydrangeaceae", "Cone-shaped panicles that emerge a soft chartreuse green.", "Perennial"],
  ["Antique Pink Hydrangea", "Hydrangea macrophylla", "Hydrangeaceae", "Muted, dusty pink clusters with vintage appeal.", "Perennial"],
  ["Purple Hydrangea", "Hydrangea macrophylla", "Hydrangeaceae", "Deep violet clusters shaped by the acidity of their soil.", "Perennial"],
  ["Pink Carnation", "Dianthus caryophyllus", "Caryophyllaceae", "Ruffled, long-lasting pink blooms symbolizing gratitude.", "Perennial"],
  ["White Carnation", "Dianthus caryophyllus", "Caryophyllaceae", "Pure white, ruffled petals with a spicy, clove-like fragrance.", "Perennial"],
  ["Red Carnation", "Dianthus caryophyllus", "Caryophyllaceae", "Deep red, classic ruffled blooms often used in romantic bouquets.", "Perennial"],
  ["Peach Carnation", "Dianthus caryophyllus", "Caryophyllaceae", "A vintage, dusty peach tone with heavily textured layers.", "Perennial"],
  ["Green Trick Dianthus", "Dianthus barbatus", "Caryophyllaceae", "A unique, spherical, fuzzy green bloom with no actual petals.", "Biennial"],

  // --- TULIPS (61-70) ---
  ["Purple Tulip", "Tulipa gesneriana", "Liliaceae", "Elegant, cup-shaped spring blooms in a deep, majestic purple.", "Perennial"],
  ["Parrot Tulip", "Tulipa 'Parrot'", "Liliaceae", "Heavily ruffled, feathered edges with striking bicolored streaks.", "Perennial"],
  ["Queen of Night Tulip", "Tulipa 'Queen of Night'", "Liliaceae", "A dramatic, late-spring tulip so dark purple it appears almost black.", "Perennial"],
  ["Fringed White Tulip", "Tulipa crispa", "Liliaceae", "Pure white petals edged with delicate, crystalline fringes.", "Perennial"],
  ["Angelique Tulip", "Tulipa 'Angelique'", "Liliaceae", "Soft pink, double-layered petals that closely resemble a peony.", "Perennial"],
  ["Yellow Darwin Hybrid Tulip", "Tulipa", "Liliaceae", "Classic, strong-stemmed, massive golden yellow blooms.", "Perennial"],
  ["Red Emperor Tulip", "Tulipa fosteriana", "Liliaceae", "Huge, brilliant red petals opening wide in the spring sun.", "Perennial"],
  ["Shirley Tulip", "Tulipa", "Liliaceae", "Ivory white petals that slowly develop a soft purple edge as they mature.", "Perennial"],
  ["Princess Irene Tulip", "Tulipa", "Liliaceae", "Vibrant orange petals flamed with striking purple markings.", "Perennial"],
  ["Ice Cream Tulip", "Tulipa", "Liliaceae", "A unique double tulip resembling a scoop of vanilla ice cream in a pink cone.", "Perennial"],

  // --- RANUNCULUS & ANEMONES (71-80) ---
  ["Pink Ranunculus", "Ranunculus asiaticus", "Ranunculaceae", "Endless layers of tissue-thin, delicate pink petals.", "Perennial"],
  ["White Ranunculus", "Ranunculus asiaticus", "Ranunculaceae", "Pure white, tightly wrapped petals forming a perfect rosette.", "Perennial"],
  ["Burgundy Ranunculus", "Ranunculus asiaticus", "Ranunculaceae", "Deep, moody wine-red layers perfect for dramatic styling.", "Perennial"],
  ["Orange Ranunculus", "Ranunculus asiaticus", "Ranunculaceae", "Vibrant, citrus-orange layers packed tightly into a rosette.", "Perennial"],
  ["Butterfly Ranunculus", "Ranunculus 'Butterfly'", "Ranunculaceae", "Shimmering, wax-like single petals in a soft, sunny yellow.", "Perennial"],
  ["White Anemone", "Anemone coronaria", "Ranunculaceae", "Striking white petals contrasted by a velvety dark center.", "Perennial"],
  ["Bordeaux Anemone", "Anemone coronaria", "Ranunculaceae", "Deep wine-red petals surrounding a signature dark core.", "Perennial"],
  ["Blue Anemone", "Anemone coronaria", "Ranunculaceae", "Vibrant, almost ultraviolet blue petals with a dark center.", "Perennial"],
  ["Pink Anemone", "Anemone hupehensis", "Ranunculaceae", "Delicate, dancing pink petals commonly known as the Japanese Anemone.", "Perennial"],
  ["Double White Anemone", "Anemone coronaria", "Ranunculaceae", "Multiple layers of ruffled white petals giving a fuller, textured look.", "Perennial"],

  // --- DAISIES, SUNFLOWERS, CHRYSANTHEMUMS (81-90) ---
  ["Golden Sunflower", "Helianthus annuus", "Asteraceae", "Massive, bright yellow blooms with a large, dark seeded center.", "Annual"],
  ["Teddy Bear Sunflower", "Helianthus annuus", "Asteraceae", "A fluffy, fully double sunflower resembling a golden plush toy.", "Annual"],
  ["White Shasta Daisy", "Leucanthemum x superbum", "Asteraceae", "Classic white petals surrounding a bright yellow center.", "Perennial"],
  ["Pink Gerbera Daisy", "Gerbera jamesonii", "Asteraceae", "Large, cheerful, intensely bright pink blooms on leafless stems.", "Perennial"],
  ["Orange Gerbera Daisy", "Gerbera jamesonii", "Asteraceae", "Vibrant, neon-orange petals offering a perfect burst of color.", "Perennial"],
  ["White Spider Mums", "Chrysanthemum morifolium", "Asteraceae", "Long, tubular, spidery white petals cascading outward.", "Perennial"],
  ["Bronze Cushion Mum", "Chrysanthemum", "Asteraceae", "A tight, rounded bloom packed with deep bronze-orange petals.", "Perennial"],
  ["Green Button Poms", "Chrysanthemum", "Asteraceae", "Small, bright green, spherical blooms perfect for filling arrangements.", "Perennial"],
  ["Pink Aster", "Symphyotrichum", "Asteraceae", "Tiny, star-like pink blooms with yellow centers that bloom in late fall.", "Perennial"],
  ["Purple Echinacea", "Echinacea purpurea", "Asteraceae", "Drooping purple petals surrounding a prominent, spiky copper cone.", "Perennial"],

  // --- WILDFLOWERS, FILLERS & EXOTICS (91-100) ---
  ["Blue Delphinium", "Delphinium elatum", "Ranunculaceae", "Tall, dramatic spires completely covered in true-blue flowers.", "Biennial"],
  ["Lavender Sweet Pea", "Lathyrus odoratus", "Fabaceae", "Delicate, ruffled blossoms with an incredibly romantic fragrance.", "Annual"],
  ["White Scabiosa", "Scabiosa caucasica", "Caprifoliaceae", "A delicate pincushion flower in pure white, offering great texture.", "Biennial"],
  ["Black Knight Scabiosa", "Scabiosa atropurpurea", "Caprifoliaceae", "Pincushion-like blooms in an intensely dark, maroon-black color.", "Biennial"],
  ["Yellow Freesia", "Freesia corymbosa", "Iridaceae", "Arching stems lined with vibrant yellow, trumpet-shaped blossoms.", "Perennial"],
  ["White Baby's Breath", "Gypsophila paniculata", "Caryophyllaceae", "Clouds of tiny, delicate white blooms used as the ultimate filler.", "Annual"],
  ["Blue Thistle", "Eryngium", "Apiaceae", "Spiky, metallic blue blooms that add architectural edge.", "Biennial"],
  ["King Protea", "Protea cynaroides", "Proteaceae", "A massive flower with a fuzzy crown of pink and white bracts.", "Perennial"],
  ["Blushing Bride Protea", "Serruria florida", "Proteaceae", "Delicate, pointed ivory petals blushing with soft pink.", "Perennial"],
  ["Orange Bird of Paradise", "Strelitzia reginae", "Strelitziaceae", "Striking orange and blue petals resembling a tropical bird in flight.", "Perennial"],

  // --- IRISES & GLADIOLUS (101-110) ---
  ["Bearded Iris", "Iris germanica", "Iridaceae", "Distinctive ruffled petals featuring a fuzzy 'beard' cascading down the center.", "Perennial"],
  ["Siberian Iris", "Iris sibirica", "Iridaceae", "Delicate, beardless blue and violet blooms sitting atop tall, grassy foliage.", "Perennial"],
  ["Dutch Iris", "Iris x hollandica", "Iridaceae", "Sleek, architectural blooms often seen in vibrant yellows and deep blues.", "Perennial"],
  ["Japanese Iris", "Iris ensata", "Iridaceae", "Enormous, flat-topped blossoms that thrive in wet, boggy soils.", "Perennial"],
  ["Black Iris", "Iris chrysographes", "Iridaceae", "An incredibly rare, striking flower with petals so dark purple they appear black.", "Perennial"],
  ["Red Gladiolus", "Gladiolus hortulanus", "Iridaceae", "Tall, sword-like stalks packed tightly with trumpet-shaped red blooms.", "Perennial"],
  ["Green Star Gladiolus", "Gladiolus", "Iridaceae", "Unique, lime-green blooms that provide incredible height to arrangements.", "Perennial"],
  ["Blue Isle Gladiolus", "Gladiolus", "Iridaceae", "Cool, icy blue petals tightly clustered on a towering summer stalk.", "Perennial"],
  ["Plum Tart Gladiolus", "Gladiolus", "Iridaceae", "Rich, velvety magenta blooms that open successively from bottom to top.", "Perennial"],
  ["White Prosperity Gladiolus", "Gladiolus", "Iridaceae", "Pure snow-white ruffled blossoms that represent faithfulness and honor.", "Perennial"],

  // --- ZINNIAS & MARIGOLDS (111-120) ---
  ["California Giant Zinnia", "Zinnia elegans", "Asteraceae", "Massive, vibrant, fully double blooms that thrive in intense summer heat.", "Annual"],
  ["Queen Red Lime Zinnia", "Zinnia elegans", "Asteraceae", "Fascinating antique-looking blooms blending dusty maroon and muted lime green.", "Annual"],
  ["Thumbelina Zinnia", "Zinnia elegans", "Asteraceae", "Charming, dwarf-sized plants exploding with tiny, brightly colored blossoms.", "Annual"],
  ["Zahara Double Fire Zinnia", "Zinnia marylandica", "Asteraceae", "Disease-resistant plants featuring intensely bright red-orange double flowers.", "Annual"],
  ["Peppermint Stick Zinnia", "Zinnia elegans", "Asteraceae", "Playful blooms featuring white petals heavily speckled and striped with red.", "Annual"],
  ["African Marigold", "Tagetes erecta", "Asteraceae", "Large, pom-pom like blooms in brilliant shades of yellow and bright orange.", "Annual"],
  ["French Marigold", "Tagetes patula", "Asteraceae", "Compact, bushy plants with striking bicolored blooms of mahogany and gold.", "Annual"],
  ["Signet Marigold", "Tagetes tenuifolia", "Asteraceae", "Delicate, edible, single-petal blossoms with a strong lemon fragrance.", "Annual"],
  ["Vanilla Marigold", "Tagetes erecta", "Asteraceae", "A rare, stunning marigold featuring creamy, pale yellow-white blossoms.", "Annual"],
  ["Strawberry Blonde Marigold", "Tagetes patula", "Asteraceae", "Unique blooms that transition through shades of plum, pink, and yellow.", "Annual"],

  // --- COSMOS & POPPIES (121-130) ---
  ["Sensation Pink Cosmos", "Cosmos bipinnatus", "Asteraceae", "Large, daisy-like pink blossoms floating on delicate, fern-like foliage.", "Annual"],
  ["Chocolate Cosmos", "Cosmos atrosanguineus", "Asteraceae", "Velvety, dark maroon flowers that genuinely emit the scent of dark chocolate.", "Perennial"],
  ["Seashells Cosmos", "Cosmos bipinnatus", "Asteraceae", "Intriguing tubular petals that roll inward, resembling fluted seashells.", "Annual"],
  ["Sulphur Orange Cosmos", "Cosmos sulphureus", "Asteraceae", "Intensely bright, fiery orange blooms that aggressively attract butterflies.", "Annual"],
  ["Purity White Cosmos", "Cosmos bipinnatus", "Asteraceae", "Luminous, pure white blossoms featuring a starkly contrasting yellow center.", "Annual"],
  ["Oriental Poppy", "Papaver orientale", "Papaveraceae", "Enormous, papery scarlet petals surrounding a dramatic, ink-black center.", "Perennial"],
  ["California Poppy", "Eschscholzia californica", "Papaveraceae", "Bright, cheerful orange-gold cups that close up tightly during cloudy weather.", "Annual"],
  ["Iceland Poppy", "Papaver nudicaule", "Papaveraceae", "Incredibly delicate, translucent petals in pastel shades of lemon, peach, and pink.", "Perennial"],
  ["Shirley Poppy", "Papaver rhoeas", "Papaveraceae", "Soft, crinkled petals often featuring beautiful picotee edges and pastel hues.", "Annual"],
  ["Himalayan Blue Poppy", "Meconopsis betonicifolia", "Papaveraceae", "A highly coveted, notoriously difficult-to-grow flower with pure sky-blue petals.", "Perennial"],

  // --- SNAPDRAGONS, FOXGLOVES & HOLLYHOCKS (131-140) ---
  ["Rocket Snapdragon", "Antirrhinum majus", "Plantaginaceae", "Tall, sturdy spikes heavily packed with bright, jaw-like blooming florets.", "Annual"],
  ["Black Prince Snapdragon", "Antirrhinum majus", "Plantaginaceae", "Striking, dark crimson blooms contrasted against dramatically dark bronze foliage.", "Annual"],
  ["Madame Butterfly Snapdragon", "Antirrhinum majus", "Plantaginaceae", "Unique, double-petaled snapdragons that resemble ruffled azalea blooms.", "Annual"],
  ["Common Foxglove", "Digitalis purpurea", "Plantaginaceae", "Towering woodland spires covered in tubular, bell-shaped purple flowers with speckled throats.", "Biennial"],
  ["Camelot White Foxglove", "Digitalis purpurea", "Plantaginaceae", "Elegant, tall white spires that bloom reliably in their very first year.", "Biennial"],
  ["Peach Foxglove", "Digitalis purpurea", "Plantaginaceae", "Soft, pastel peach-toned bells that bring romantic height to cottage gardens.", "Biennial"],
  ["Black Watchman Hollyhock", "Alcea rosea", "Malvaceae", "Dramatic, towering stalks holding nearly black, velvety maroon blossoms.", "Biennial"],
  ["Chaters Double Pink Hollyhock", "Alcea rosea", "Malvaceae", "Massive, ruffled double blooms that strongly resemble pink carnations on tall stalks.", "Biennial"],
  ["Halo Apricot Hollyhock", "Alcea rosea", "Malvaceae", "Warm, sunset-apricot petals featuring a distinct, contrasting deep magenta halo at the center.", "Biennial"],
  ["Yellow Hollyhock", "Alcea rosea", "Malvaceae", "Bright, sunny yellow cup-shaped blooms that climb high against garden fences.", "Biennial"],

  // --- HIBISCUS & TROPICALS (141-150) ---
  ["Luna Red Hibiscus", "Hibiscus moscheutos", "Malvaceae", "Gigantic, dinner-plate sized, vibrant red blooms that thrive in summer heat.", "Perennial"],
  ["Tropical Yellow Hibiscus", "Hibiscus rosa-sinensis", "Malvaceae", "Bright yellow, ruffled petals featuring a contrasting deep pink throat.", "Perennial"],
  ["Blue Chiffon Rose of Sharon", "Hibiscus syriacus", "Malvaceae", "Lacy, semi-double lavender-blue blossoms born on a hardy, woody shrub.", "Perennial"],
  ["Pink Chandelier Medinilla", "Medinilla magnifica", "Melastomataceae", "Incredible, drooping panicles of pink flowers cascading from large tropical leaves.", "Perennial"],
  ["Red Anthurium", "Anthurium andraeanum", "Araceae", "A highly glossy, waxy red heart-shaped spathe with a prominent yellow spadix.", "Perennial"],
  ["White Ginger Lily", "Hedychium coronarium", "Zingiberaceae", "Exquisitely fragrant, butterfly-like white blossoms native to tropical rainforests.", "Perennial"],
  ["Pink Frangipani", "Plumeria rubra", "Apocynaceae", "Highly fragrant, pinwheel-shaped flowers famously used to create Hawaiian leis.", "Perennial"],
  ["Yellow Allamanda", "Allamanda cathartica", "Apocynaceae", "Large, vibrant yellow trumpet flowers blooming aggressively on tropical vines.", "Perennial"],
  ["Red Heliconia", "Heliconia rostrata", "Heliconiaceae", "Striking, pendulous, claw-shaped red and yellow bracts cascading like a waterfall.", "Perennial"],
  ["Orange Bougainvillea", "Bougainvillea spectabilis", "Nyctaginaceae", "Papery, brilliantly colored neon-orange bracts exploding in vibrant clusters.", "Perennial"],

  // --- SPRING BULBS (151-160) ---
  ["King Alfred Daffodil", "Narcissus", "Amaryllidaceae", "The quintessential, large-cupped, brilliant yellow trumpet of early spring.", "Perennial"],
  ["Thalia Daffodil", "Narcissus triandrus", "Amaryllidaceae", "Elegant, pure white nodding blooms known as the 'Orchid Daffodil'.", "Perennial"],
  ["Tahiti Double Daffodil", "Narcissus", "Amaryllidaceae", "Spectacular, multi-layered yellow petals interwoven with bright orange-red ruffles.", "Perennial"],
  ["Blue Jacket Hyacinth", "Hyacinthus orientalis", "Asparagaceae", "Dense, highly fragrant spikes of deep, nautical-blue star-shaped florets.", "Perennial"],
  ["Pink Pearl Hyacinth", "Hyacinthus orientalis", "Asparagaceae", "Vibrant, intensely fragrant, cotton-candy pink blooms that emerge in early spring.", "Perennial"],
  ["Purple Sensation Allium", "Allium hollandicum", "Amaryllidaceae", "Perfectly spherical, globe-like clusters of tiny metallic-purple flowers.", "Perennial"],
  ["Globemaster Allium", "Allium", "Amaryllidaceae", "Massive, volleyball-sized silvery-violet flower heads towering on sturdy stems.", "Perennial"],
  ["Giant Crocus", "Crocus vernus", "Iridaceae", "Bright purple, cup-shaped flowers that bravely push straight up through late winter snow.", "Perennial"],
  ["Yellow Mammoth Crocus", "Crocus flavus", "Iridaceae", "Brilliant, golden-yellow blooms offering the very first color of the gardening season.", "Perennial"],
  ["Snake's Head Fritillary", "Fritillaria meleagris", "Liliaceae", "Fascinating, nodding, bell-shaped flowers decorated in a distinct checkerboard pattern.", "Perennial"],

  // --- BEGONIAS, PETUNIAS & IMPATIENS (161-170) ---
  ["Nonstop Red Begonia", "Begonia x tuberhybrida", "Begoniaceae", "Spectacular, fully double crimson flowers resembling small roses that bloom continuously.", "Annual"],
  ["Dragon Wing Pink Begonia", "Begonia", "Begoniaceae", "Arching, angel-wing shaped leaves cascading with bright, pendulous pink flowers.", "Annual"],
  ["Night Sky Petunia", "Petunia cultivars", "Solanaceae", "Mesmerizing deep purple petals speckled with white dots, resembling a starry galaxy.", "Annual"],
  ["Wave Carmine Velour Petunia", "Petunia cultivars", "Solanaceae", "Intensely bright, velvety magenta blooms that rapidly trail and spread.", "Annual"],
  ["Black Mamba Petunia", "Petunia cultivars", "Solanaceae", "Striking, ultra-dark, velvety black flowers that add incredible contrast to hanging baskets.", "Annual"],
  ["Superbells Lemon Calibrachoa", "Calibrachoa", "Solanaceae", "Hundreds of tiny, bright yellow, petunia-like blooms cascading from window boxes.", "Annual"],
  ["Divine Orange New Guinea Impatiens", "Impatiens hawkeri", "Balsaminaceae", "Vibrant, flat-faced neon orange flowers contrasted against dark, bronze foliage.", "Annual"],
  ["Rockapulco White Impatiens", "Impatiens walleriana", "Balsaminaceae", "Exquisite, miniature double blooms that resemble tiny, pure white rosebuds.", "Annual"],
  ["Beacon Violet Impatiens", "Impatiens walleriana", "Balsaminaceae", "Highly disease-resistant, shade-loving plants exploding with bright purple blossoms.", "Annual"],
  ["SunPatiens Blush Pink", "Impatiens", "Balsaminaceae", "A robust, sun-tolerant hybrid offering non-stop, soft pastel pink flowers.", "Annual"],

  // --- PANSIES, VIOLAS & ALYSSUM (171-180) ---
  ["Matrix Blue True Pansy", "Viola x wittrockiana", "Violaceae", "Large, cheerful, pure blue faces that thrive in cool spring and autumn weather.", "Biennial"],
  ["Delta Fire Pansy", "Viola x wittrockiana", "Violaceae", "Striking, deeply colored blooms blending mahogany, bright orange, and yellow.", "Biennial"],
  ["Black Accord Pansy", "Viola x wittrockiana", "Violaceae", "Inky, velvety black petals that bring a dramatic flair to early spring borders.", "Biennial"],
  ["Sorbet Lemon Blueberry Viola", "Viola cornuta", "Violaceae", "Tiny, prolific blooms showcasing a vibrant contrast of soft yellow and deep violet.", "Biennial"],
  ["Tiger Eye Viola", "Viola cornuta", "Violaceae", "Intriguing golden-yellow petals etched heavily with dramatic, dark brown veins.", "Biennial"],
  ["Sweet Violet", "Viola odorata", "Violaceae", "Tiny, deeply fragrant, wild purple blossoms that heavily perfume the spring air.", "Perennial"],
  ["Snow Crystals Sweet Alyssum", "Lobularia maritima", "Brassicaceae", "Carpets of tiny, honey-scented, pure white flowers that spill over garden edges.", "Annual"],
  ["Royal Carpet Alyssum", "Lobularia maritima", "Brassicaceae", "Low-growing, sweet-smelling mats packed tight with vibrant purple blossoms.", "Annual"],
  ["Clear Crystal Apricot Alyssum", "Lobularia maritima", "Brassicaceae", "A unique, pastel apricot-peach variation of the classic trailing border flower.", "Annual"],
  ["Trailing Lobelia", "Lobelia erinus", "Campanulaceae", "Cascading waves of intensely vivid, true-blue flowers perfect for hanging baskets.", "Annual"],

  // --- CLIMBERS & VINES (181-190) ---
  ["Jackmanii Clematis", "Clematis 'Jackmanii'", "Ranunculaceae", "The quintessential climbing vine producing an abundance of huge, velvety dark purple blooms.", "Perennial"],
  ["Nelly Moser Clematis", "Clematis 'Nelly Moser'", "Ranunculaceae", "Massive, star-shaped pale pink flowers featuring a striking, hot-pink central stripe.", "Perennial"],
  ["Heavenly Blue Morning Glory", "Ipomoea tricolor", "Convolvulaceae", "Vibrant, sky-blue trumpet flowers that twist open rapidly at the first light of dawn.", "Annual"],
  ["Moonflower", "Ipomoea alba", "Convolvulaceae", "Enormous, heavily fragrant white trumpets that unfurl magically as the sun sets.", "Annual"],
  ["Black Eyed Susan Vine", "Thunbergia alata", "Acanthaceae", "Bright, cheerful yellow-orange blooms featuring a distinctly stark, dark brown center.", "Annual"],
  ["Purple Wisteria", "Wisteria sinensis", "Fabaceae", "Romantic, heavily fragrant, cascading racemes of lilac-purple flowers on a woody vine.", "Perennial"],
  ["White Wisteria", "Wisteria floribunda 'Alba'", "Fabaceae", "Incredibly long, elegant, snow-white flower chains that drape beautifully from pergolas.", "Perennial"],
  ["Climbing Iceberg Rose", "Rosa 'Iceberg'", "Rosaceae", "A vigorous, climbing mutation of the famous floribunda, covered in pure white blooms.", "Perennial"],
  ["Mandevilla Alice Dupont", "Mandevilla", "Apocynaceae", "A tropical, twisting vine bursting with large, trumpet-shaped, vibrant pink flowers.", "Annual"],
  ["Passionflower", "Passiflora incarnata", "Passifloraceae", "Incredibly complex, alien-like blooms featuring a prominent fringe of purple and white filaments.", "Perennial"],

  // --- UNIQUE, WILD & WOODLAND (191-200) ---
  ["Pink Bleeding Heart", "Lamprocapnos spectabilis", "Papaveraceae", "Arching woodland stems dripping with perfect, puffy pink and white heart-shaped lockets.", "Perennial"],
  ["White Bleeding Heart", "Lamprocapnos spectabilis 'Alba'", "Papaveraceae", "A stunning, luminous pure-white variation of the classic, pendulous heart flowers.", "Perennial"],
  ["Origami Red Columbine", "Aquilegia", "Ranunculaceae", "Intricate, geometric blooms featuring bold red outer petals and backward-pointing spurs.", "Perennial"],
  ["Rocky Mountain Columbine", "Aquilegia coerulea", "Ranunculaceae", "Elegant, star-like flowers boasting striking blue and white bicolored petals.", "Perennial"],
  ["Gallery Blue Lupin", "Lupinus", "Fabaceae", "Stately, dense architectural spires packed with striking blue and white pea-like blossoms.", "Perennial"],
  ["Russell Mix Lupin", "Lupinus polyphyllus", "Fabaceae", "Towering, magnificent spires in a wild rainbow of pinks, reds, yellows, and purples.", "Perennial"],
  ["Paprika Yarrow", "Achillea millefolium", "Asteraceae", "Flat, clustered flower heads in fiery shades of dusty red and paprika-orange.", "Perennial"],
  ["Moonshine Yarrow", "Achillea", "Asteraceae", "Bright, lemon-yellow flower clusters contrasting beautifully against silvery, fern-like foliage.", "Perennial"],
  ["Miss Huff Lantana", "Lantana camara", "Verbenaceae", "Tough, heat-loving clusters that transition beautifully through rings of pink, orange, and yellow.", "Perennial"],
  ["Purple Verbena", "Verbena bonariensis", "Verbenaceae", "Tall, wiry, see-through stems topped with tight, vibrant clusters of tiny magenta-purple flowers.", "Perennial"]
];

const finalFlowerCollection = rawFlowerData.map(flower => {
  const meta = extractTruthfulData(flower[0], flower[2], flower[3]);
  return {
    commonName: flower[0],
    scientificName: flower[1],
    family: flower[2],
    description: flower[3],
    lifecycle: flower[4],
    imageUrl: meta.imageUrl,
    color: meta.color,
    petalShape: meta.petalShape,
    type: meta.type,
    symbolism: meta.symbolism,
    tags: ["catalogue", flower[2].toLowerCase(), flower[4].toLowerCase()]
  };
});

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in your .env file!");
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    
    await Flower.deleteMany({});
    console.log("Cleared old database...");
    
    await Flower.insertMany(finalFlowerCollection);
    console.log(`Success! Seeded EXACTLY ${finalFlowerCollection.length} uniquely classified flowers!`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();