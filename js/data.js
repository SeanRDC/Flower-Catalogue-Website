// ===== FLOWER STORAGE SYSTEM WITH PERSISTENCE =====

// Try to use sessionStorage, fallback to window property
let storageBackend;
try {
    sessionStorage.setItem('test', 'test');
    sessionStorage.removeItem('test');
    storageBackend = 'sessionStorage';
} catch (e) {
    storageBackend = 'window';
}

// Initialize storage location
if (storageBackend === 'window') {
    if (!window.top.flowerStorage) {
        window.top.flowerStorage = {
            favorites: [],
            collections: []
        };
    }
}

// Storage helper functions
const StorageHelper = {
    get: function(key) {
        try {
            if (storageBackend === 'sessionStorage') {
                const data = sessionStorage.getItem(key);
                return data ? JSON.parse(data) : [];
            } else {
                return window.top.flowerStorage[key] || [];
            }
        } catch (e) {
            console.error('Error reading storage:', e);
            return [];
        }
    },
    
    set: function(key, value) {
        try {
            if (storageBackend === 'sessionStorage') {
                sessionStorage.setItem(key, JSON.stringify(value));
            } else {
                window.top.flowerStorage[key] = value;
            }
            return true;
        } catch (e) {
            console.error('Error writing storage:', e);
            return false;
        }
    }
};

console.log('✅ Using storage backend:', storageBackend);

// Flower data structure
class Flower {
    constructor(name, image, description) {
        this.name = name;
        this.image = image;
        this.description = description;
        this.dateAdded = new Date().toISOString();
    }
}

// Favorites Manager
const FavoritesManager = {
    getAll: function() {
        const favorites = StorageHelper.get('favorites');
        console.log('📖 FavoritesManager.getAll():', favorites.length, 'items');
        return favorites;
    },
    
    add: function(flower) {
        console.log('➕ Adding to favorites:', flower.name);
        const favorites = this.getAll();
        
        if (this.has(flower.name)) {
            console.log('⚠️ Already in favorites');
            return { success: false, message: 'Already in favorites' };
        }
        
        favorites.push(flower);
        StorageHelper.set('favorites', favorites);
        console.log('✅ Added to favorites. Total:', favorites.length);
        return { success: true, message: 'Added to favorites' };
    },
    
    remove: function(flowerName) {
        console.log('➖ Removing from favorites:', flowerName);
        const favorites = this.getAll();
        const filtered = favorites.filter(f => f.name !== flowerName);
        
        if (filtered.length === favorites.length) {
            console.log('⚠️ Not found in favorites');
            return { success: false, message: 'Not found in favorites' };
        }
        
        StorageHelper.set('favorites', filtered);
        console.log('✅ Removed from favorites. Total:', filtered.length);
        return { success: true, message: 'Removed from favorites' };
    },
    
    has: function(flowerName) {
        const favorites = this.getAll();
        return favorites.some(f => f.name === flowerName);
    },
    
    count: function() {
        return this.getAll().length;
    },
    
    toggle: function(flower) {
        if (this.has(flower.name)) {
            return this.remove(flower.name);
        } else {
            return this.add(flower);
        }
    }
};

// Collections Manager
const CollectionsManager = {
    getAll: function() {
        const collections = StorageHelper.get('collections');
        console.log('📖 CollectionsManager.getAll():', collections.length, 'items');
        return collections;
    },
    
    add: function(flower) {
        console.log('➕ Adding to collections:', flower.name);
        const collections = this.getAll();
        
        if (this.has(flower.name)) {
            console.log('⚠️ Already in collections');
            return { success: false, message: 'Already in collections' };
        }
        
        collections.push(flower);
        StorageHelper.set('collections', collections);
        console.log('✅ Added to collections. Total:', collections.length);
        return { success: true, message: 'Added to collections' };
    },
    
    remove: function(flowerName) {
        console.log('➖ Removing from collections:', flowerName);
        const collections = this.getAll();
        const filtered = collections.filter(f => f.name !== flowerName);
        
        if (filtered.length === collections.length) {
            console.log('⚠️ Not found in collections');
            return { success: false, message: 'Not found in collections' };
        }
        
        StorageHelper.set('collections', filtered);
        console.log('✅ Removed from collections. Total:', filtered.length);
        return { success: true, message: 'Removed from collections' };
    },
    
    has: function(flowerName) {
        const collections = this.getAll();
        return collections.some(f => f.name === flowerName);
    },
    
    count: function() {
        return this.getAll().length;
    },
    
    toggle: function(flower) {
        if (this.has(flower.name)) {
            return this.remove(flower.name);
        } else {
            return this.add(flower);
        }
    }
};

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: sans-serif;
        font-size: 15px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for notifications and button states
const style = document.createElement('style');
style.textContent = `
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
    
    .action-btn.favorited svg {
        fill: #e74c3c;
        stroke: #e74c3c;
    }
    
    .action-btn.in-collection svg {
        fill: #8B5E83;
        stroke: #8B5E83;
    }
    
    .action-btn {
        transition: all 0.3s ease;
    }
    
    .action-btn:active {
        transform: scale(0.9);
    }
`;
document.head.appendChild(style);

// Export to window
window.FavoritesManager = FavoritesManager;
window.CollectionsManager = CollectionsManager;
window.Flower = Flower;
window.showNotification = showNotification;

console.log('✅ Storage System Initialized');
console.log('📊 Current Favorites:', FavoritesManager.count());
console.log('📊 Current Collections:', CollectionsManager.count());