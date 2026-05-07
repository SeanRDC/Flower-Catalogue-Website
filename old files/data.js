// ===== FLOWER STORAGE SYSTEM WITH REST API BACKEND =====

const API_BASE = 'http://localhost:3000/api';

class Flower {
    constructor(name, image, description) {
        this.name = name;
        this.image = image;
        this.description = description;
        this.dateAdded = new Date().toISOString();
    }
}

// Favorites Manager (Now uses Fetch API to talk to backend)
const FavoritesManager = {
    getAll: async function() {
        try {
            const response = await fetch(`${API_BASE}/favorites`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching favorites:', error);
            return [];
        }
    },
    
    add: async function(flower) {
        try {
            const response = await fetch(`${API_BASE}/favorites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(flower)
            });
            const result = await response.json();
            if(result.success) showNotification(result.message, 'success');
            return result;
        } catch (error) {
            console.error('Error adding favorite:', error);
            return { success: false };
        }
    },
    
    remove: async function(flowerName) {
        try {
            const response = await fetch(`${API_BASE}/favorites/${encodeURIComponent(flowerName)}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if(result.success) showNotification(result.message, 'success');
            return result;
        } catch (error) {
            console.error('Error removing favorite:', error);
            return { success: false };
        }
    },
    
    has: async function(flowerName) {
        const favorites = await this.getAll();
        return favorites.some(f => f.name === flowerName);
    }
};

// Collections Manager (Now uses Fetch API)
const CollectionsManager = {
    getAll: async function() {
        try {
            const response = await fetch(`${API_BASE}/collections`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching collections:', error);
            return [];
        }
    },
    
    add: async function(flower) {
        try {
            const response = await fetch(`${API_BASE}/collections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(flower)
            });
            const result = await response.json();
            if(result.success) showNotification(result.message, 'success');
            return result;
        } catch (error) {
            console.error('Error adding collection:', error);
            return { success: false };
        }
    },
    
    remove: async function(flowerName) {
        try {
            const response = await fetch(`${API_BASE}/collections/${encodeURIComponent(flowerName)}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if(result.success) showNotification(result.message, 'success');
            return result;
        } catch (error) {
            console.error('Error removing collection:', error);
            return { success: false };
        }
    },
    
    has: async function(flowerName) {
        const collections = await this.getAll();
        return collections.some(f => f.name === flowerName);
    }
};

// Notification function remains exactly the same as your original code
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000; animation: slideIn 0.3s ease; font-family: sans-serif;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export to window for your existing HTML to use
window.FavoritesManager = FavoritesManager;
window.CollectionsManager = CollectionsManager;
window.Flower = Flower;
window.showNotification = showNotification;