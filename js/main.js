// ===== DROPDOWN FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdownId = this.getAttribute('data-dropdown');
            const dropdown = document.getElementById(dropdownId + 'Dropdown');
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('active');
                }
            });
            document.querySelectorAll('.dropdown-trigger').forEach(t => {
                if (t !== trigger) {
                    t.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            this.classList.toggle('active');
            dropdown.classList.toggle('active');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('active');
        });
        document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
            trigger.classList.remove('active');
        });
    });
});

// ===== MODAL FUNCTIONALITY =====
const signInLinks = document.querySelectorAll('.sign-in-link');
const modal = document.getElementById('signUpModal');
const closeModal = document.getElementById('closeModal');

signInLinks.forEach(link => {
    link.addEventListener('click', function() {
        modal.style.display = 'flex';
    });
});

if (closeModal) {
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// ===== PETALS CAROUSEL INFINITE LOOP =====
const petalsContainer = document.querySelector('.images-2');

// Clone all images to create seamless loop
function createInfiniteLoop() {
    const images = Array.from(petalsContainer.children);
    images.forEach(img => {
        const clone = img.cloneNode(true);
        petalsContainer.appendChild(clone);
    });
}

createInfiniteLoop();

function autoScroll() {
    petalsContainer.scrollLeft += 1;
    
    // Reset scroll position seamlessly when halfway through
    const maxScroll = petalsContainer.scrollWidth / 2;
    if (petalsContainer.scrollLeft >= maxScroll) {
        petalsContainer.scrollLeft = 0;
    }
    
    requestAnimationFrame(autoScroll);
}

// Start auto-scrolling (no pause on hover)
autoScroll();

// ===== SHOW MORE FUNCTIONALITY =====
const showMoreBtn = document.querySelector('.show-more');
const additionalFlowers = [
    {
        img: '../assets/images/tulip.jpg',
        name: 'Tulip',
        description: 'Tulips symbolize perfect love and spring renewal.'
    },
    {
        img: '../assets/images/orchid.jpg',
        name: 'Orchid',
        description: 'Orchids represent luxury, beauty, and strength.'
    },
    {
        img: '../assets/images/lavender.jpg',
        name: 'Lavender',
        description: 'Lavender symbolizes serenity, grace, and calmness.'
    },
    {
        img: '../assets/images/dahlia.jpg',
        name: 'Dahlia',
        description: 'Dahlias represent elegance, dignity, and commitment.'
    },
    {
        img: '../assets/images/marigold.jpg',
        name: 'Marigold',
        description: 'Marigolds symbolize passion, creativity, and joy.'
    },
    {
        img: '../assets/images/carnation.jpg',
        name: 'Carnation',
        description: 'Carnations represent love, fascination, and distinction.'
    },
    {
        img: '../assets/images/iris.jpg',
        name: 'Iris',
        description: 'Iris flowers symbolize wisdom, hope, and valor.'
    },
    {
        img: '../assets/images/jasmine.jpg',
        name: 'Jasmine',
        description: 'Jasmine represents love, beauty, and sensuality.'
    }
];

let currentIndex = 0;
const flowersPerLoad = 4;

showMoreBtn.addEventListener('click', function() {
    const topPicksSection = document.querySelector('.top-picks');
    const existingFrames = topPicksSection.querySelectorAll('.frame, .frame-2');
    const lastFrame = existingFrames[existingFrames.length - 1];
    
    // Create new frame
    const newFrame = document.createElement('div');
    newFrame.className = existingFrames.length % 2 === 0 ? 'frame' : 'frame-2';
    
    // Add flowers to new frame
    for (let i = 0; i < flowersPerLoad && currentIndex < additionalFlowers.length; i++) {
        const flower = additionalFlowers[currentIndex];
        
        const topPick = document.createElement('div');
        topPick.className = 'top-pick';
        topPick.innerHTML = `
            <img class="images" src="${flower.img}" alt="${flower.name}" />
            <div class="BG"></div>
            <div class="description">
                <div class="product-name-${10 + currentIndex}">${flower.name}</div>
                <p class="sort-description">${flower.description}</p>
            </div>
        `;
        
        newFrame.appendChild(topPick);
        currentIndex++;
    }
    
    // Insert new frame before the show more button
    topPicksSection.insertBefore(newFrame, showMoreBtn);
    
    // Hide button if all flowers are loaded
    if (currentIndex >= additionalFlowers.length) {
        showMoreBtn.style.display = 'none';
    }
    
    // Smooth scroll to new content
    newFrame.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});