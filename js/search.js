// ===== FLOWER SEARCH FUNCTIONALITY =====

// Get the base path for images (works for both local and GitHub Pages)
const getImagePath = (imagePath) => {
    // If on GitHub Pages, prepend the repo name
    const isGitHubPages = window.location.hostname.includes('github.io');
    const repoName = isGitHubPages ? '/Flower-Catalogue-Website' : '';
    return `${repoName}/${imagePath}`;
};

// All available flowers database
const allFlowers = [
    // Top Picks (Browse page)
    { name: 'Pink Rose', image: getImagePath('assets/images/pinkrose-sr8.jpg'), description: 'Pink roses symbolize grace, admiration, and joy.', page: 'browse' },
    { name: 'White Rose', image: getImagePath('assets/images/whiterose-sr5.jpg'), description: 'White roses symbolize purity, innocence, and new beginnings.', page: 'browse' },
    { name: 'White Hibiscus', image: getImagePath('assets/images/whitehibiscus_sr7.jpg'), description: 'White hibiscus symbolizes purity, enlightenment, and feminine energy', page: 'browse' },
    { name: 'Oxeye Daisy', image: getImagePath('assets/images/oxeyedaisy-sr9.jpg'), description: 'It symbolizes innocence, patience, and simplicity.', page: 'browse' },
    { name: 'Stargazer Lily', image: getImagePath('assets/images/stargazer-sr12.jpg'), description: 'Stargazer Lily symbolizes ambition, prosperity, and passion.', page: 'browse' },
    { name: 'Sunflower', image: getImagePath('assets/images/sunflower-sr10.jpg'), description: 'Sunflower symbolizes loyalty, warmth, and adoration.', page: 'browse' },
    { name: 'Red Rose', image: getImagePath('assets/images/redrose-sr11.jpg'), description: 'Red Rose symbolizes love, romance, and deep passion.', page: 'browse' },
    { name: 'Peony', image: getImagePath('assets/images/peony-sr13.jpg'), description: 'Peony symbolizes romance, prosperity, and honor.', page: 'browse' },
    
    // Additional flowers (Show More)
    { name: 'Tulip', image: getImagePath('assets/images/tulip-sr17.jpg'), description: 'Tulips symbolize perfect love and spring renewal.', page: 'browse' },
    { name: 'Orchid', image: getImagePath('assets/images/orchid-sr18.jpg'), description: 'Orchids represent luxury, beauty, and strength.', page: 'browse' },
    { name: 'Lavender', image: getImagePath('assets/images/lavender-sr19.jpg'), description: 'Lavender symbolizes serenity, grace, and calmness.', page: 'browse' },
    { name: 'Dahlia', image: getImagePath('assets/images/dhalia-sr20.jpg'), description: 'Dahlias represent elegance, dignity, and commitment.', page: 'browse' },
    { name: 'Marigold', image: getImagePath('assets/images/marigold-sr21.jpg'), description: 'Marigolds symbolize passion, creativity, and joy.', page: 'browse' },
    { name: 'Carnation', image: getImagePath('assets/images/carnation-sr23.jpg'), description: 'Carnations represent love, fascination, and distinction.', page: 'browse' },
    { name: 'Iris', image: getImagePath('assets/images/iris-sr24.jpg'), description: 'Iris flowers symbolize wisdom, hope, and valor.', page: 'browse' },
    { name: 'Jasmine', image: getImagePath('assets/images/jasmine-sr22.jpg'), description: 'Jasmine represents love, beauty, and sensuality.', page: 'browse' }
];

// Initialize search functionality
function initializeSearch() {
    const searchForms = document.querySelectorAll('.search-bar');
    
    searchForms.forEach(form => {
        // Changed to look for input[type="text"] instead of input[type="search"]
        const searchInput = form.querySelector('input[type="text"]');
        const searchButton = form.querySelector('.search-button');
        
        if (!searchInput || !searchButton) return;
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(searchInput.value.trim());
        });
        
        // Real-time search suggestions (optional)
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length >= 2) {
                showSearchSuggestions(query, this);
            } else {
                hideSearchSuggestions();
            }
        });
        
        // Close suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-bar')) {
                hideSearchSuggestions();
            }
        });
    });
}

// Perform search
function performSearch(query) {
    if (!query) {
        showNotification('Please enter a flower name to search', 'error');
        return;
    }
    
    console.log('🔍 Searching for:', query);
    
    // Search through all flowers
    const results = allFlowers.filter(flower => 
        flower.name.toLowerCase().includes(query.toLowerCase()) ||
        flower.description.toLowerCase().includes(query.toLowerCase())
    );
    
    console.log('📊 Found', results.length, 'results');
    
    if (results.length === 0) {
        showNotification(`No flowers found for "${query}"`, 'error');
        return;
    }
    
    // Display search results
    displaySearchResults(query, results);
}

// Display search results in a modal
function displaySearchResults(query, results) {
    // Remove existing search results modal if any
    const existingModal = document.getElementById('searchResultsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create search results modal
    const modal = document.createElement('div');
    modal.id = 'searchResultsModal';
    modal.className = 'search-results-modal';
    
    modal.innerHTML = `
        <div class="search-results-content">
            <div class="search-results-header">
                <h2>Search Results for "${query}"</h2>
                <button class="close-search-btn" aria-label="Close search results">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <p class="search-results-count">Found ${results.length} flower${results.length > 1 ? 's' : ''}</p>
            <div class="search-results-grid">
                ${results.map(flower => `
                    <div class="search-result-card" data-flower='${JSON.stringify(flower)}'>
                        <img src="${flower.image}" alt="${flower.name}" />
                        <div class="search-result-info">
                            <h3>${flower.name}</h3>
                            <p>${flower.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Prevent body scroll
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    // Add click handlers
    const closeBtn = modal.querySelector('.close-search-btn');
    closeBtn.addEventListener('click', () => closeSearchResults());
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeSearchResults();
        }
    });
    
    // Add click handlers to result cards
    const resultCards = modal.querySelectorAll('.search-result-card');
    resultCards.forEach(card => {
        card.addEventListener('click', function() {
            const flower = JSON.parse(this.getAttribute('data-flower'));
            closeSearchResults();
            
            // Open flower details
            if (typeof openExpandedFlower === 'function') {
                openExpandedFlower(flower.name, flower.image, flower.description);
            } else {
                showNotification('Opening flower details...', 'success');
                // Fallback: redirect to browse page
                setTimeout(() => {
                    window.location.href = 'browse.html';
                }, 1000);
            }
        });
    });
    
    hideSearchSuggestions();
}

// Close search results modal
function closeSearchResults() {
    const modal = document.getElementById('searchResultsModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    
    setTimeout(() => {
        modal.remove();
        
        // Restore body scroll
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }, 300);
}

// Show search suggestions
function showSearchSuggestions(query, inputElement) {
    const suggestions = allFlowers.filter(flower => 
        flower.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    if (suggestions.length === 0) return;
    
    // Remove existing suggestions
    hideSearchSuggestions();
    
    // Create suggestions dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'search-suggestions';
    dropdown.innerHTML = suggestions.map(flower => `
        <div class="search-suggestion-item" data-name="${flower.name}">
            <img src="${flower.image}" alt="${flower.name}" />
            <span>${flower.name}</span>
        </div>
    `).join('');
    
    // Position dropdown
    const searchBar = inputElement.closest('.search-bar');
    searchBar.style.position = 'relative';
    searchBar.appendChild(dropdown);
    
    // Add click handlers
    dropdown.querySelectorAll('.search-suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const flowerName = this.getAttribute('data-name');
            inputElement.value = flowerName;
            performSearch(flowerName);
            hideSearchSuggestions();
        });
    });
}

// Hide search suggestions
function hideSearchSuggestions() {
    const suggestions = document.querySelectorAll('.search-suggestions');
    suggestions.forEach(s => s.remove());
}

// Add styles for search results
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-results-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .search-results-modal.active {
        display: flex;
        opacity: 1;
    }
    
    .search-results-content {
        background: white;
        border-radius: 16px;
        max-width: 900px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        padding: 30px;
        position: relative;
    }
    
    .search-results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .search-results-header h2 {
        font-size: 24px;
        color: #333;
        margin: 0;
    }
    
    .close-search-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: background 0.2s;
    }
    
    .close-search-btn:hover {
        background: #f0f0f0;
    }
    
    .search-results-count {
        color: #666;
        margin-bottom: 20px;
        font-size: 14px;
    }
    
    .search-results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
    }
    
    .search-result-card {
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .search-result-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
    
    .search-result-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
    
    .search-result-info {
        padding: 15px;
    }
    
    .search-result-info h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        color: #333;
    }
    
    .search-result-info p {
        margin: 0;
        font-size: 14px;
        color: #666;
        line-height: 1.4;
    }
    
    /* Search Suggestions */
    .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e0e0e0;
        border-top: none;
        border-radius: 0 0 8px 8px;
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .search-suggestion-item {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        cursor: pointer;
        transition: background 0.2s;
        gap: 12px;
    }
    
    .search-suggestion-item:hover {
        background: #f5f5f5;
    }
    
    .search-suggestion-item img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 6px;
    }
    
    .search-suggestion-item span {
        font-size: 14px;
        color: #333;
    }
    
    /* Mobile responsiveness */
    @media (max-width: 768px) {
        .search-results-content {
            width: 95%;
            padding: 20px;
            max-height: 90vh;
        }
        
        .search-results-grid {
            grid-template-columns: 1fr;
        }
        
        .search-results-header h2 {
            font-size: 20px;
        }
    }
`;
document.head.appendChild(searchStyles);

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSearch);

// Close search results with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSearchResults();
    }
});

console.log('✅ Search functionality initialized');
console.log('📚 Searchable flowers:', allFlowers.length);