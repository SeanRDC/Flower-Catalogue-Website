// ===== SELECTED PICK FUNCTIONALITY =====
// This script handles the flower modal and interaction with storage

// Extended flower descriptions
const flowerDetails = {
    'Pink Rose': 'Pink roses symbolize grace, admiration, and joy. They are often given to express gratitude, appreciation, and admiration. The delicate pink hue represents gentleness, happiness, and sweetness. Pink roses are perfect for celebrating friendships, expressing sympathy, or showing someone you care. Their soft color makes them ideal for romantic gestures that are sweet rather than passionate.',
    'White Rose': 'White roses symbolize purity, innocence, and new beginnings. They are traditionally associated with weddings and new starts, representing hope and virtue. White roses also convey reverence and remembrance, making them appropriate for honoring loved ones. Their pristine beauty has made them a symbol of true love and loyalty throughout history.',
    'White Hibiscus': 'White hibiscus symbolizes purity, enlightenment, and feminine energy. In many cultures, it represents beauty, charm, and delicate grace. The white hibiscus is often used in spiritual ceremonies and is believed to attract positive energy. Its large, elegant blooms make it a favorite in tropical gardens and as a symbol of hospitality.',
    'Oxeye Daisy': 'The oxeye daisy symbolizes innocence, patience, and simplicity. With its cheerful white petals and bright yellow center, it represents purity of thought and loyal love. This wildflower has been used in traditional medicine and is often associated with childhood memories and carefree summer days. It embodies natural beauty and the simple joys of life.',
    'Stargazer Lily': 'Stargazer lilies symbolize ambition, prosperity, and passion. Their dramatic appearance and intoxicating fragrance make them a favorite for special occasions. The upward-facing blooms represent looking toward the future with hope and determination. Stargazer lilies are often associated with success, wealth, and achieving one\'s dreams.',
    'Sunflower': 'Sunflowers symbolize loyalty, warmth, and adoration. Their bright yellow petals and tendency to follow the sun represent positivity, strength, and lasting happiness. Sunflowers are associated with faithfulness and longevity, making them perfect for expressing devoted love and loyalty. They also represent vitality and the ability to find joy even in difficult times.',
    'Red Rose': 'Red roses symbolize love, romance, and deep passion. They are the ultimate expression of romantic love and desire, representing intense emotions and devotion. Red roses have been the flower of choice for lovers throughout history, conveying messages of "I love you" and eternal commitment. Their rich color and velvety petals embody beauty, courage, and respect.',
    'Peony': 'Peonies symbolize romance, prosperity, and honor. In Chinese culture, they are known as the "king of flowers" and represent good fortune, happy marriage, and nobility. Peonies are associated with bashfulness and compassion, making them popular for weddings and romantic occasions. Their lush, full blooms represent a happy life and prosperous marriage.'
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

// Current flower being viewed
let currentFlower = null;

// Function to update button states
function updateButtonStates(flowerName) {
    if (!addToFavoritesBtn || !addToCollectionBtn) return;
    
    // Update favorites button
    if (window.FavoritesManager && window.FavoritesManager.has(flowerName)) {
        addToFavoritesBtn.classList.add('favorited');
        addToFavoritesBtn.title = 'Remove from favorites';
    } else {
        addToFavoritesBtn.classList.remove('favorited');
        addToFavoritesBtn.title = 'Add to favorites';
    }
    
    // Update collections button
    if (window.CollectionsManager && window.CollectionsManager.has(flowerName)) {
        addToCollectionBtn.classList.add('in-collection');
        addToCollectionBtn.title = 'Remove from collections';
    } else {
        addToCollectionBtn.classList.remove('in-collection');
        addToCollectionBtn.title = 'Add to collections';
    }
}

// Function to open expanded modal
function openExpandedFlower(flowerName, flowerImage, shortDescription) {
    if (!expandedModal) return;
    
    const fullDescription = flowerDetails[flowerName] || shortDescription;
    
    // Store current flower (using window.Flower if available)
    if (window.Flower) {
        currentFlower = new window.Flower(flowerName, flowerImage, fullDescription);
    } else {
        currentFlower = {
            name: flowerName,
            image: flowerImage,
            description: fullDescription
        };
    }
    
    if (expandedFlowerImage) expandedFlowerImage.src = flowerImage;
    if (expandedFlowerImage) expandedFlowerImage.alt = flowerName;
    if (fullscreenImage) fullscreenImage.src = flowerImage;
    if (fullscreenImage) fullscreenImage.alt = flowerName;
    if (expandedFlowerName) expandedFlowerName.textContent = flowerName;
    if (expandedFlowerDescription) expandedFlowerDescription.textContent = fullDescription;
    
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

// Function to close expanded modal
function closeExpandedFlower() {
    if (!expandedModal) return;
    
    expandedModal.classList.remove('active');
    
    setTimeout(() => {
        expandedModal.style.display = 'none';
        currentFlower = null;
        
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
    if (fullscreenModal) {
        fullscreenModal.classList.add('active');
    }
}

// Function to close fullscreen
function closeFullscreen() {
    if (fullscreenModal) {
        fullscreenModal.classList.remove('active');
    }
}

// Add click events to all flower tiles
document.addEventListener('DOMContentLoaded', function() {
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
});

// Add to collections button handler
if (addToCollectionBtn) {
    addToCollectionBtn.addEventListener('click', function() {
        if (!currentFlower) return;
        
        if (window.CollectionsManager) {
            if (window.CollectionsManager.has(currentFlower.name)) {
                // Remove from collections
                window.CollectionsManager.remove(currentFlower.name);
                if (window.showNotification) {
                    window.showNotification(`"${currentFlower.name}" removed from collections`, 'success');
                }
                updateButtonStates(currentFlower.name);
            } else {
                // Add to collections
                const result = window.CollectionsManager.add(currentFlower);
                if (result.success && window.showNotification) {
                    window.showNotification(`"${currentFlower.name}" added to collections!`, 'success');
                }
                updateButtonStates(currentFlower.name);
            }
            
            console.log('Collections:', window.CollectionsManager.getAll());
            console.log('Total in collections:', window.CollectionsManager.count());
        }
    });
}

// Add to favorites button handler
if (addToFavoritesBtn) {
    addToFavoritesBtn.addEventListener('click', function() {
        if (!currentFlower) return;
        
        if (window.FavoritesManager) {
            if (window.FavoritesManager.has(currentFlower.name)) {
                // Remove from favorites
                window.FavoritesManager.remove(currentFlower.name);
                if (window.showNotification) {
                    window.showNotification(`"${currentFlower.name}" removed from favorites`, 'success');
                }
                updateButtonStates(currentFlower.name);
            } else {
                // Add to favorites
                const result = window.FavoritesManager.add(currentFlower);
                if (result.success && window.showNotification) {
                    window.showNotification(`"${currentFlower.name}" added to favorites!`, 'success');
                }
                updateButtonStates(currentFlower.name);
            }
            
            console.log('Favorites:', window.FavoritesManager.getAll());
            console.log('Total in favorites:', window.FavoritesManager.count());
        }
    });
}

// Download image button handler
if (downloadImageBtn) {
    downloadImageBtn.addEventListener('click', function() {
        if (!currentFlower) return;
        
        const link = document.createElement('a');
        link.href = currentFlower.image;
        link.download = `${currentFlower.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        if (window.showNotification) {
            window.showNotification(`"${currentFlower.name}" image is being downloaded!`, 'success');
        }
    });
}

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

// Make function available globally
window.openExpandedFlower = openExpandedFlower;