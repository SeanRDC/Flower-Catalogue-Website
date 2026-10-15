// Every value classifyFlower can produce, in the order the filter bar shows them
export const FLOWER_TRAITS = {
  color: ['Red', 'Pink', 'White', 'Yellow', 'Purple', 'Blue', 'Orange', 'Green'],
  petalShape: ['Rounded', 'Pointed', 'Ruffled', 'Spider-like'],
  type: ['Rose', 'Lily', 'Tulip', 'Orchid', 'Daisy', 'Peony', 'Carnation', 'Other'],
  symbolism: ['Love', 'Purity', 'Friendship', 'Strength', 'Peace', 'Joy'],
};

// Derives the filterable traits (color, petal shape, type, symbolism) of a
// flower from its name, botanical family and description. Shared by the
// seed script and the startup sync so the database always matches it.
export const classifyFlower = (name, family = '', description = '') => {
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

  // Name checks come before family checks: tulips belong to the lily family
  // (Liliaceae), so testing the family first labelled every tulip a "Lily".
  if (lowerName.includes("tulip")) type = "Tulip";
  else if (lowerName.includes("rose") || lowerFamily.includes("rosaceae")) type = "Rose";
  else if (lowerName.includes("lily") || lowerFamily.includes("liliaceae") || lowerFamily.includes("araceae")) type = "Lily";
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

  return { color, petalShape, type, symbolism };
};
