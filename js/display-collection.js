// ===== DISPLAY COLLECTIONS PAGE =====
// This script loads and displays all collected flowers on the collection.html page

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the collections page
    const favoriteSection = document.querySelector('.favorite');
    if (!favoriteSection) return;
    
    // Get the title element
    const titleElement = favoriteSection.querySelector('.title');
    if (titleElement && titleElement.textContent === 'Collections') {
        loadCollections();
    }
});

function loadCollections() {
    const collections = CollectionsManager.getAll();
    
    // Get the container frames
    const frame1 = document.querySelector('.favorite .frame');
    const frame2 = document.querySelector('.favorite .frame-2');
    
    if (!frame1 || !frame2) {
        console.error('Collection containers not found');
        return;
    }
    
    // Always clear existing content first
    frame1.innerHTML = '';
    frame2.innerHTML = '';
    
    // Check if collections is empty - SHOW EMPTY STATE
    if (!collections || collections.length === 0) {
        displayEmptyState(frame1);
        frame2.style.display = 'none';
        
        // Update title to show count
        const titleElement = document.querySelector('.favorite .title');
        if (titleElement) {
            titleElement.textContent = 'Collections (0)';
        }
        return;
    }
    
    // Show both frames if there are collections
    frame1.style.display = 'flex';
    frame2.style.display = 'flex';
    
    // Display collections
    collections.forEach((flower, index) => {
        const flowerCard = createFlowerCard(flower);
        
        // Distribute flowers between two frames (4 per frame)
        if (index < 4) {
            frame1.appendChild(flowerCard);
        } else {
            frame2.appendChild(flowerCard);
        }
    });
    
    // Update count in title
    const titleElement = document.querySelector('.favorite .title');
    if (titleElement) {
        titleElement.textContent = `Collections (${collections.length})`;
    }
}

function createFlowerCard(flower) {
    const card = document.createElement('div');
    card.className = 'top-pick';
    
    card.innerHTML = `
        <img class="images" src="${flower.image}" alt="${flower.name}" />
        <div class="description">
            <div class="product-name-2">${flower.name}</div>
            <p class="sort-description">${getShortDescription(flower.description)}</p>
        </div>
        <button class="remove-btn" data-flower="${flower.name}" title="Remove from collections">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;
    
    // Add click event to open expanded view
    card.addEventListener('click', function(e) {
        // Don't open if clicking remove button
        if (e.target.closest('.remove-btn')) return;
        
        const img = this.querySelector('.images');
        const nameElement = this.querySelector('.product-name-2');
        const descElement = this.querySelector('.sort-description');
        
        if (img && nameElement && descElement) {
            openExpandedFlower(nameElement.textContent, img.src, flower.description);
        }
    });
    
    // Add remove button functionality
    const removeBtn = card.querySelector('.remove-btn');
    removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        removeFromCollections(flower.name, card);
    });
    
    return card;
}

function removeFromCollections(flowerName, cardElement) {
    // Confirm removal
    if (confirm(`Remove "${flowerName}" from collections?`)) {
        CollectionsManager.remove(flowerName);
        
        // Animate removal
        cardElement.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            loadCollections(); // Reload the page
            showNotification(`"${flowerName}" removed from collections`, 'success');
        }, 300);
    }
}

function getShortDescription(fullDescription) {
    // Get first sentence or first 100 characters
    const firstSentence = fullDescription.split('.')[0] + '.';
    return firstSentence.length > 100 
        ? fullDescription.substring(0, 100) + '...' 
        : firstSentence;
}

function displayEmptyState(container) {
    container.innerHTML = `
        <div style="width: 100%; text-align: center; padding: 80px 20px; min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.5" style="margin-bottom: 30px; opacity: 0.5;">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <h2 style="font-size: 28px; color: #666; margin-bottom: 15px; font-weight: 600;">No Added Collections</h2>
            <p style="font-size: 18px; color: #999; margin-bottom: 40px; max-width: 500px; line-height: 1.6;">
                Start building your flower collection! Browse our catalog and click the grid icon to add flowers to your personal collection.
            </p>
            <a href="index.html" style="display: inline-block; padding: 14px 35px; background: #8B5E83; color: white; text-decoration: none; border-radius: 10px; font-weight: 500; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(139, 94, 131, 0.3);">
                Browse Flowers
            </a>
        </div>
    `;
}

// Add CSS for remove button and animation
const style = document.createElement('style');
style.textContent = `
    .top-pick {
        position: relative;
    }
    
    .remove-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .top-pick:hover .remove-btn {
        opacity: 1;
    }
    
    .remove-btn:hover {
        background: #e74c3c;
        transform: scale(1.1);
    }
    
    .remove-btn:hover svg {
        stroke: white;
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);