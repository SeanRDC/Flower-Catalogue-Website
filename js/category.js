// ===== CATEGORY FILTERING FUNCTIONALITY =====

// Get the base path for images (works for both local and GitHub Pages)
const getImagePath = (imagePath) => {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const repoName = isGitHubPages ? '/Flower-Catalogue-Website' : '';
    return `${repoName}/${imagePath}`;
};

// Flower database with categories
const flowerDatabase = {
    annual: [
        { name: 'Marigold', image: getImagePath('assets/images/marigold-sr21.jpg'), description: 'Marigolds symbolize passion, creativity, and joy.' },
        { name: 'Petunia', image: getImagePath('assets/images/peony-sr13.jpg'), description: 'Petunias represent comfort and keeping company with someone.' },
        { name: 'Zinnia', image: getImagePath('assets/images/sunflower-sr10.jpg'), description: 'Zinnias symbolize thoughts of an absent friend and lasting affection.' },
        { name: 'Cosmos', image: getImagePath('assets/images/pinkrose-sr8.jpg'), description: 'Cosmos flowers represent order, harmony, and peace.' },
        { name: 'Impatiens', image: getImagePath('assets/images/whiterose-sr5.jpg'), description: 'Impatiens symbolize motherly love and patience.' },
        { name: 'Snapdragon', image: getImagePath('assets/images/redrose-sr11.jpg'), description: 'Snapdragons represent grace and strength.' },
        { name: 'Sweet Pea', image: getImagePath('assets/images/lavender-sr19.jpg'), description: 'Sweet peas symbolize blissful pleasure and delicate beauty.' },
        { name: 'Calendula', image: getImagePath('assets/images/oxeyedaisy-sr9.jpg'), description: 'Calendula represents winning grace and protection.' }
    ],
    biennial: [
        { name: 'Foxglove', image: getImagePath('assets/images/iris-sr24.jpg'), description: 'Foxgloves symbolize healing, protection, and magic.' },
        { name: 'Sweet William', image: getImagePath('assets/images/carnation-sr23.jpg'), description: 'Sweet William represents gallantry and finesse.' },
        { name: 'Canterbury Bells', image: getImagePath('assets/images/orchid-sr18.jpg'), description: 'Canterbury Bells symbolize gratitude and constancy.' },
        { name: 'Hollyhock', image: getImagePath('assets/images/stargazer-sr12.jpg'), description: 'Hollyhocks represent ambition and fruitfulness.' },
        { name: 'Forget-Me-Not', image: getImagePath('assets/images/whitehibiscus_sr7.jpg'), description: 'Forget-me-nots symbolize true love and remembrance.' },
        { name: 'Stock Flower', image: getImagePath('assets/images/tulip-sr17.jpg'), description: 'Stock flowers represent lasting beauty and contentment.' },
        { name: 'Wallflower', image: getImagePath('assets/images/jasmine-sr22.jpg'), description: 'Wallflowers symbolize faithfulness in adversity.' },
        { name: 'Honesty', image: getImagePath('assets/images/dhalia-sr20.jpg'), description: 'Honesty flowers represent transparency and sincerity.' }
    ],
    perennial: [
        { name: 'Rose', image: getImagePath('assets/images/redrose-sr11.jpg'), description: 'Roses symbolize love, romance, and deep passion.' },
        { name: 'Peony', image: getImagePath('assets/images/peony-sr13.jpg'), description: 'Peonies represent romance, prosperity, and honor.' },
        { name: 'Lavender', image: getImagePath('assets/images/lavender-sr19.jpg'), description: 'Lavender symbolizes serenity, grace, and calmness.' },
        { name: 'Dahlia', image: getImagePath('assets/images/dhalia-sr20.jpg'), description: 'Dahlias represent elegance, dignity, and commitment.' },
        { name: 'Iris', image: getImagePath('assets/images/iris-sr24.jpg'), description: 'Iris flowers symbolize wisdom, hope, and valor.' },
        { name: 'Lily', image: getImagePath('assets/images/stargazer-sr12.jpg'), description: 'Lilies represent purity, passion, and rebirth.' },
        { name: 'Tulip', image: getImagePath('assets/images/tulip-sr17.jpg'), description: 'Tulips symbolize perfect love and spring renewal.' },
        { name: 'Hibiscus', image: getImagePath('assets/images/whitehibiscus_sr7.jpg'), description: 'Hibiscus symbolizes delicate beauty and femininity.' }
    ]
};

// Store current state
let currentCategory = null;
let isFilterActive = false;
let originalTopPicks = null;

// Initialize category functionality
function initializeCategoryFilter() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryText = this.querySelector('.category-text').textContent.toLowerCase();
            showCategoryFlowers(categoryText);
        });
    });
}

// Show flowers by category
function showCategoryFlowers(category) {
    currentCategory = category;
    isFilterActive = true;
    
    const flowers = flowerDatabase[category];
    
    if (!flowers) {
        console.error('Category not found:', category);
        return;
    }
    
    // Store original content if not already stored
    if (!originalTopPicks) {
        const topPicksSection = document.querySelector('.top-picks');
        originalTopPicks = {
            title: topPicksSection.querySelector('.title').textContent,
            frame1: topPicksSection.querySelector('.frame').innerHTML,
            frame2: topPicksSection.querySelector('.frame-2').innerHTML
        };
    }
    
    // Hide categories section
    const categoriesSection = document.querySelector('.categories');
    if (categoriesSection) {
        categoriesSection.style.display = 'none';
    }
    
    // Hide petals section
    const petalsSection = document.querySelector('.share');
    if (petalsSection) {
        petalsSection.style.display = 'none';
    }
    
    // Update top picks section
    const topPicksSection = document.querySelector('.top-picks');
    if (topPicksSection) {
        updateTopPicksSection(topPicksSection, category, flowers);
    }
    
    // Update sub-nav to show categories
    updateSubNav(true);
    
    // Show notification
    showCategoryNotification(category);
    
    // Smooth scroll to top picks
    setTimeout(() => {
        topPicksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Update the top picks section with category flowers
function updateTopPicksSection(section, category, flowers) {
    // Update title
    const title = section.querySelector('.title');
    if (title) {
        title.textContent = `${capitalizeFirst(category)} Flowers`;
    }
    
    // Clear existing frames
    const frame1 = section.querySelector('.frame');
    const frame2 = section.querySelector('.frame-2');
    
    if (frame1) frame1.innerHTML = '';
    if (frame2) frame2.innerHTML = '';
    
    // Split flowers into two rows (4 per row)
    const firstRow = flowers.slice(0, 4);
    const secondRow = flowers.slice(4, 8);
    
    // Populate first row
    if (frame1) {
        firstRow.forEach(flower => {
            frame1.appendChild(createFlowerCard(flower));
        });
    }
    
    // Populate second row
    if (frame2) {
        secondRow.forEach(flower => {
            frame2.appendChild(createFlowerCard(flower));
        });
    }
    
    // Update "Show more" button to "Back to Browse"
    const showMoreBtn = section.querySelector('.show-more');
    if (showMoreBtn) {
        const btnText = showMoreBtn.querySelector('.text-wrapper-11');
        if (btnText) {
            btnText.textContent = 'Back to Browse';
        }
        
        // Remove old listeners and add new one
        const newBtn = showMoreBtn.cloneNode(true);
        showMoreBtn.parentNode.replaceChild(newBtn, showMoreBtn);
        newBtn.addEventListener('click', resetToBrowse);
    }
}

// Create a flower card element
function createFlowerCard(flower) {
    const card = document.createElement('div');
    card.className = 'top-pick';
    card.innerHTML = `
        <img class="images" src="${flower.image}" alt="${flower.name}" />
        <div class="description">
            <div class="product-name-2">${flower.name}</div>
            <p class="sort-description">${flower.description}</p>
        </div>
    `;
    
    // Add click event for expanded view
    card.addEventListener('click', function(e) {
        e.preventDefault();
        if (typeof openExpandedFlower === 'function') {
            openExpandedFlower(flower.name, flower.image, flower.description);
        }
    });
    
    return card;
}

// Reset to browse view
function resetToBrowse() {
    currentCategory = null;
    isFilterActive = false;
    
    // Show categories section
    const categoriesSection = document.querySelector('.categories');
    if (categoriesSection) {
        categoriesSection.style.display = 'block';
    }
    
    // Show petals section
    const petalsSection = document.querySelector('.share');
    if (petalsSection) {
        petalsSection.style.display = 'block';
    }
    
    // Restore original top picks
    if (originalTopPicks) {
        const topPicksSection = document.querySelector('.top-picks');
        const title = topPicksSection.querySelector('.title');
        const frame1 = topPicksSection.querySelector('.frame');
        const frame2 = topPicksSection.querySelector('.frame-2');
        
        if (title) title.textContent = originalTopPicks.title;
        if (frame1) frame1.innerHTML = originalTopPicks.frame1;
        if (frame2) frame2.innerHTML = originalTopPicks.frame2;
        
        // Re-attach click handlers to restored cards
        const topPicks = topPicksSection.querySelectorAll('.top-pick');
        topPicks.forEach(pick => {
            pick.addEventListener('click', function() {
                const name = this.querySelector('[class*="product-name-"]').textContent;
                const image = this.querySelector('.images').src;
                const description = this.querySelector('.sort-description').textContent;
                
                if (typeof openExpandedFlower === 'function') {
                    openExpandedFlower(name, image, description);
                }
            });
        });
        
        // Restore show more button
        const showMoreBtn = topPicksSection.querySelector('.show-more');
        if (showMoreBtn) {
            const btnText = showMoreBtn.querySelector('.text-wrapper-11');
            if (btnText) {
                btnText.textContent = 'Show more';
            }
        }
    }
    
    // Restore original sub-nav
    updateSubNav(false);
    
    // Scroll to categories
    setTimeout(() => {
        const categoriesSection = document.querySelector('.categories');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

// Update sub-navigation based on state
function updateSubNav(filterMode = false) {
    const subNavBar = document.querySelector('.sub-nav-bar');
    if (!subNavBar) return;
    
    if (filterMode) {
        subNavBar.innerHTML = `
            <a href="#" data-category="annual">Annual</a>
            <a href="#" data-category="biennial">Biennial</a>
            <a href="#" data-category="perennial">Perennial</a>
        `;
        
        // Add click handlers for category links
        const categoryLinks = subNavBar.querySelectorAll('a[data-category]');
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                showCategoryFlowers(category);
                
                // Update active state
                categoryLinks.forEach(l => l.style.fontWeight = '500');
                this.style.fontWeight = '700';
            });
        });
        
        // Highlight current category
        const currentLink = subNavBar.querySelector(`a[data-category="${currentCategory}"]`);
        if (currentLink) {
            currentLink.style.fontWeight = '700';
        }
    } else {
        // Restore original sub-nav
        subNavBar.innerHTML = `
            <a href="#browse">Browse</a>
            <a href="#top-picks">Top picks</a>
            <a href="#petals">Petals</a>
        `;
    }
}

// Helper function to capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Show notification
function showCategoryNotification(category) {
    // Remove existing notification
    const existingNotification = document.querySelector('.category-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'category-notification';
    notification.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Showing ${capitalizeFirst(category)} flowers</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .category-notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .category-notification.hide {
        animation: slideOut 0.3s ease;
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCategoryFilter);
} else {
    initializeCategoryFilter();
}

console.log('✅ Category filtering initialized');
console.log('📂 Available categories:', Object.keys(flowerDatabase));