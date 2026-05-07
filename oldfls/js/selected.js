// ===== SELECTED PICK FUNCTIONALITY (FIXED) =====

// Extended flower descriptions
const flowerDetails = {
    'Pink Rose': 'Pink roses symbolize grace, admiration, and joy. They are often given to express gratitude, appreciation, and admiration. The delicate pink hue represents gentleness, happiness, and sweetness. Pink roses are perfect for celebrating friendships, expressing sympathy, or showing someone you care. Their soft color makes them ideal for romantic gestures that are sweet rather than passionate.',
    'White Rose': 'White roses symbolize purity, innocence, and new beginnings. They are traditionally associated with weddings and new starts, representing hope and virtue. White roses also convey reverence and remembrance, making them appropriate for honoring loved ones. Their pristine beauty has made them a symbol of true love and loyalty throughout history.',
    'White Hibiscus': 'White hibiscus symbolizes purity, enlightenment, and feminine energy. In many cultures, it represents beauty, charm, and delicate grace. The white hibiscus is often used in spiritual ceremonies and is believed to attract positive energy. Its large, elegant blooms make it a favorite in tropical gardens and as a symbol of hospitality.',
    'Oxeye Daisy': 'The oxeye daisy symbolizes innocence, patience, and simplicity. With its cheerful white petals and bright yellow center, it represents purity of thought and loyal love. This wildflower has been used in traditional medicine and is often associated with childhood memories and carefree summer days. It embodies natural beauty and the simple joys of life.',
    'Stargazer Lily': 'Stargazer lilies symbolize ambition, prosperity, and passion. Their dramatic appearance and intoxicating fragrance make them a favorite for special occasions. The upward-facing blooms represent looking toward the future with hope and determination. Stargazer lilies are often associated with success, wealth, and achieving one\'s dreams.',
    'Sunflower': 'Sunflowers symbolize loyalty, warmth, and adoration. Their bright yellow petals and tendency to follow the sun represent positivity, strength, and lasting happiness. Sunflowers are associated with faithfulness and longevity, making them perfect for expressing devoted love and loyalty. They also represent vitality and the ability to find joy even in difficult times.',
    'Red Rose': 'Red roses symbolize love, romance, and deep passion. They are the ultimate expression of romantic love and desire, representing intense emotions and devotion. Red roses have been the flower of choice for lovers throughout history, conveying messages of "I love you" and eternal commitment. Their rich color and velvety petals embody beauty, courage, and respect.',
    'Peony': 'Peonies symbolize romance, prosperity, and honor. In Chinese culture, they are known as the "king of flowers" and represent good fortune, happy marriage, and nobility. Peonies are associated with bashfulness and compassion, making them popular for weddings and romantic occasions. Their lush, full blooms represent a happy life and prosperous marriage.',
    'Tulip': 'Tulips symbolize perfect love and spring renewal. Different colors convey different meanings, but overall they represent elegance, grace, and new beginnings. Tulips are associated with fresh starts and the promise of spring. Their simple yet sophisticated appearance makes them a symbol of true love and refined beauty.',
    'Orchid': 'Orchids represent luxury, beauty, and strength. These exotic flowers symbolize love, refinement, and thoughtfulness. In ancient Greece, orchids were associated with virility and fertility. Today, they represent rare and delicate beauty, making them perfect for expressing admiration and respect. Their long-lasting blooms symbolize enduring love.',
    'Lavender': 'Lavender symbolizes serenity, grace, and calmness. Its soothing fragrance has been used for centuries to promote relaxation and peace. Lavender represents purity, silence, and devotion. It\'s often associated with healing, tranquility, and spiritual cleansing. The purple blooms also symbolize elegance and refinement.',
    'Dahlia': 'Dahlias represent elegance, dignity, and commitment. Their intricate petals and diverse colors symbolize inner strength and creativity. Dahlias are often given to show appreciation and gratitude. They represent lasting bonds and standing strong through challenges. In Victorian times, dahlias symbolized a lasting commitment between two people.',
    'Marigold': 'Marigolds symbolize passion, creativity, and joy. Their vibrant colors represent the warmth of the sun and the beauty of life. In many cultures, marigolds are used in celebrations and religious ceremonies. They represent resurrection and the cycle of life. Marigolds are also associated with winning someone\'s affection through charm.',
    'Carnation': 'Carnations represent love, fascination, and distinction. Different colors convey different meanings: pink carnations symbolize a mother\'s love, red represents admiration, and white signifies pure love. Carnations are long-lasting flowers, symbolizing devotion and loyalty. They have been cultivated for over 2,000 years and remain popular for their beauty and fragrance.',
    'Iris': 'Iris flowers symbolize wisdom, hope, and valor. Named after the Greek goddess of the rainbow, irises represent communication and messages. The three upright petals symbolize faith, valor, and wisdom. Purple irises convey compliments and wisdom, while blue irises represent hope and faith. They are often associated with royalty and eloquence.',
    'Jasmine': 'Jasmine represents love, beauty, and sensuality. Its intoxicating fragrance has made it a symbol of romance and passion in many cultures. White jasmine symbolizes pure love and attachment, while yellow jasmine represents modesty and grace. Jasmine is often associated with the moon and nighttime, representing mystery and elegance.'
};

// Modal elements
const expandedModal = document.getElementById('expandedFlowerModal');
const fullscreenModal = document.getElementById('fullscreenModal');
const closeExpandedBtn = document.getElementById('closeExpandedBtn');
const expandFullscreenBtn = document.getElementById('expandFullscreenBtn');
const closeFullscreenBtn = document.getElementById('closeFullscreenBtn');
const expandedFlowerImage = document.getElementById('expandedFlowerImage');
const fullscreenImage = document.getElementById('fullscreenImage');
const expandedFlowerName = document.getElementById('expandedFlowerName');
const expandedFlowerDescription = document.getElementById('expandedFlowerDescription');

// Action buttons
const addToCollectionBtn = document.getElementById('addToCollectionBtn');
const addToFavoritesBtn = document.getElementById('addToFavoritesBtn');
const downloadImageBtn = document.getElementById('downloadImageBtn');

// Store current flower data
let currentFlower = null;

// Function to open expanded modal
function openExpandedFlower(flowerName, flowerImage, shortDescription) {
    const fullDescription = flowerDetails[flowerName] || shortDescription;
    
    // Store current flower data
    currentFlower = new Flower(flowerName, flowerImage, fullDescription);
    
    expandedFlowerImage.src = flowerImage;
    expandedFlowerImage.alt = flowerName;
    fullscreenImage.src = flowerImage;
    fullscreenImage.alt = flowerName;
    expandedFlowerName.textContent = flowerName;
    expandedFlowerDescription.textContent = fullDescription;
    
    // Update button states
    updateButtonStates(flowerName);
    
    // Show modal
    expandedModal.style.display = 'flex';
    setTimeout(() => {
        expandedModal.classList.add('active');
    }, 10);
    
    // Prevent body scroll
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
}

// Function to update button states
function updateButtonStates(flowerName) {
    // Check if action buttons exist (they won't on favorite/collection pages)
    if (addToFavoritesBtn) {
        if (FavoritesManager.has(flowerName)) {
            addToFavoritesBtn.classList.add('favorited');
            addToFavoritesBtn.title = 'Remove from favorites';
        } else {
            addToFavoritesBtn.classList.remove('favorited');
            addToFavoritesBtn.title = 'Add to favorites';
        }
    }
    
    if (addToCollectionBtn) {
        if (CollectionsManager.has(flowerName)) {
            addToCollectionBtn.classList.add('in-collection');
            addToCollectionBtn.title = 'Remove from collections';
        } else {
            addToCollectionBtn.classList.remove('in-collection');
            addToCollectionBtn.title = 'Add to collections';
        }
    }
}

// Function to close expanded modal
function closeExpandedFlower() {
    expandedModal.classList.remove('active');
    
    setTimeout(() => {
        expandedModal.style.display = 'none';
        
        // Restore body scroll
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }, 300);
}

// Function to open fullscreen
function openFullscreen() {
    fullscreenModal.classList.add('active');
}

// Function to close fullscreen
function closeFullscreen() {
    fullscreenModal.classList.remove('active');
}

// Add click events to all flower tiles
document.querySelectorAll('.top-pick').forEach(tile => {
    tile.addEventListener('click', function(e) {
        // Don't open if clicking remove button
        if (e.target.closest('.remove-btn')) return;
        
        const img = this.querySelector('.images');
        const nameElement = this.querySelector('[class*="product-name-"]');
        const descElement = this.querySelector('.sort-description');
        
        if (img && nameElement && descElement) {
            const flowerName = nameElement.textContent;
            const flowerImage = img.src;
            const shortDescription = descElement.textContent;
            
            openExpandedFlower(flowerName, flowerImage, shortDescription);
        }
    });
});

// Close expanded modal
if (closeExpandedBtn) {
    closeExpandedBtn.addEventListener('click', closeExpandedFlower);
}

// Open fullscreen
if (expandFullscreenBtn) {
    expandFullscreenBtn.addEventListener('click', openFullscreen);
}

// Close fullscreen
if (closeFullscreenBtn) {
    closeFullscreenBtn.addEventListener('click', closeFullscreen);
}

// Close expanded modal when clicking outside
if (expandedModal) {
    expandedModal.addEventListener('click', function(e) {
        if (e.target === expandedModal) {
            closeExpandedFlower();
        }
    });
}

// Close fullscreen when clicking outside image
if (fullscreenModal) {
    fullscreenModal.addEventListener('click', function(e) {
        if (e.target === fullscreenModal) {
            closeFullscreen();
        }
    });
}

// Add to collections - FIXED
if (addToCollectionBtn) {
    addToCollectionBtn.addEventListener('click', function() {
        if (!currentFlower) return;
        
        const result = CollectionsManager.toggle(currentFlower);
        
        // Update button state
        if (CollectionsManager.has(currentFlower.name)) {
            this.classList.add('in-collection');
            this.title = 'Remove from collections';
            showNotification(`"${currentFlower.name}" added to collections!`, 'success');
        } else {
            this.classList.remove('in-collection');
            this.title = 'Add to collections';
            showNotification(`"${currentFlower.name}" removed from collections`, 'success');
        }
        
        console.log('Collections count:', CollectionsManager.count());
    });
}

// Add to favorites - FIXED
if (addToFavoritesBtn) {
    addToFavoritesBtn.addEventListener('click', function() {
        if (!currentFlower) return;
        
        const result = FavoritesManager.toggle(currentFlower);
        
        // Update button state
        if (FavoritesManager.has(currentFlower.name)) {
            this.classList.add('favorited');
            this.title = 'Remove from favorites';
            showNotification(`"${currentFlower.name}" added to favorites!`, 'success');
        } else {
            this.classList.remove('favorited');
            this.title = 'Add to favorites';
            showNotification(`"${currentFlower.name}" removed from favorites`, 'success');
        }
        
        console.log('Favorites count:', FavoritesManager.count());
    });
}

// Download image
if (downloadImageBtn) {
    downloadImageBtn.addEventListener('click', function() {
        if (!currentFlower) return;
        
        const flowerName = expandedFlowerName.textContent;
        const imageSrc = expandedFlowerImage.src;
        
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = `${flowerName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification(`"${flowerName}" image is downloading!`, 'success');
    });
}

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (fullscreenModal && fullscreenModal.classList.contains('active')) {
            closeFullscreen();
        } else if (expandedModal && expandedModal.classList.contains('active')) {
            closeExpandedFlower();
        }
    }
});

// Export function to window for use in other scripts
window.openExpandedFlower = openExpandedFlower;

console.log('✅ Selected flower functionality initialized');