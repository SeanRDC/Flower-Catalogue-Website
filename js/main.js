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

// ===== SHOW MORE/LESS FUNCTIONALITY =====
const showMoreBtn = document.querySelector('.show-more');
const additionalFlowers = [
    {
        img: '../assets/images/tulip-sr17.jpg',
        name: 'Tulip',
        description: 'Tulips symbolize perfect love and spring renewal.'
    },
    {
        img: '../assets/images/orchid-sr18.jpg',
        name: 'Orchid',
        description: 'Orchids represent luxury, beauty, and strength.'
    },
    {
        img: '../assets/images/lavender-sr19.jpg',
        name: 'Lavender',
        description: 'Lavender symbolizes serenity, grace, and calmness.'
    },
    {
        img: '../assets/images/dhalia-sr20.jpg',
        name: 'Dahlia',
        description: 'Dahlias represent elegance, dignity, and commitment.'
    },
    {
        img: '../assets/images/marigold-sr21.jpg',
        name: 'Marigold',
        description: 'Marigolds symbolize passion, creativity, and joy.'
    },
    {
        img: '../assets/images/carnation-sr23.jpg',
        name: 'Carnation',
        description: 'Carnations represent love, fascination, and distinction.'
    },
    {
        img: '../assets/images/iris-sr24.jpg',
        name: 'Iris',
        description: 'Iris flowers symbolize wisdom, hope, and valor.'
    },
    {
        img: '../assets/images/jasmine-sr22.jpg',
        name: 'Jasmine',
        description: 'Jasmine represents love, beauty, and sensuality.'
    }
];

let isExpanded = false;
let additionalFrames = [];

showMoreBtn.addEventListener('click', function() {
    const topPicksSection = document.querySelector('.top-picks');
    
    if (!isExpanded) {
        // SHOW MORE - Create and show all additional flowers
        let currentIndex = 0;
        const flowersPerFrame = 4;
        
        while (currentIndex < additionalFlowers.length) {
            const newFrame = document.createElement('div');
            newFrame.className = 'frame additional-frame';
            newFrame.style.maxHeight = '0';
            newFrame.style.opacity = '0';
            newFrame.style.overflow = 'hidden';
            newFrame.style.transition = 'max-height 0.6s ease, opacity 0.6s ease, margin 0.6s ease';
            newFrame.style.marginBottom = '0';
            
            // Add flowers to frame
            for (let i = 0; i < flowersPerFrame && currentIndex < additionalFlowers.length; i++) {
                const flower = additionalFlowers[currentIndex];
                
                const topPick = document.createElement('div');
                topPick.className = 'top-pick';
                topPick.innerHTML = `
                    <img class="images" src="${flower.img}" alt="${flower.name}" />
                    <div class="description">
                        <div class="product-name-${10 + currentIndex}">${flower.name}</div>
                        <p class="sort-description">${flower.description}</p>
                    </div>
                `;
                
                newFrame.appendChild(topPick);
                currentIndex++;
            }
            
            topPicksSection.insertBefore(newFrame, showMoreBtn);
            additionalFrames.push(newFrame);
        }
        
        // Trigger animation
        setTimeout(() => {
            additionalFrames.forEach((frame, index) => {
                setTimeout(() => {
                    frame.style.maxHeight = '600px';
                    frame.style.opacity = '1';
                    frame.style.marginBottom = '20px';
                }, index * 150);
            });
        }, 10);
        
        // Update button
        showMoreBtn.querySelector('.text-wrapper-11').textContent = 'Show less';
        isExpanded = true;
        
    } else {
        // SHOW LESS - Hide all additional flowers
        additionalFrames.reverse().forEach((frame, index) => {
            setTimeout(() => {
                frame.style.maxHeight = '0';
                frame.style.opacity = '0';
                frame.style.marginBottom = '0';
            }, index * 150);
        });
        
        // Remove frames after animation
        setTimeout(() => {
            additionalFrames.forEach(frame => frame.remove());
            additionalFrames = [];
        }, additionalFrames.length * 150 + 600);
        
        // Update button
        showMoreBtn.querySelector('.text-wrapper-11').textContent = 'Show more';
        isExpanded = false;
        
        // Scroll back to top picks section
        topPicksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

