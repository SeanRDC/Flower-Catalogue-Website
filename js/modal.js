// ===== DROPDOWN FUNCTIONALITY =====
const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
let activeDropdown = null;

// Function to close all dropdowns
function closeAllDropdowns() {
    const allDropdowns = document.querySelectorAll('.dropdown-menu');
    const allTriggers = document.querySelectorAll('.dropdown-trigger');
    
    allDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
    });
    
    allTriggers.forEach(trigger => {
        trigger.classList.remove('active');
        const chevron = trigger.querySelector('.chevron-icon');
        if (chevron) {
            chevron.style.transform = 'rotate(0deg)';
        }
    });
    
    activeDropdown = null;
}

// Function to toggle dropdown
function toggleDropdown(trigger) {
    const dropdown = trigger.querySelector('.dropdown-menu');
    const chevron = trigger.querySelector('.chevron-icon');
    
    // If clicking the same dropdown, close it
    if (activeDropdown === dropdown && dropdown.classList.contains('active')) {
        closeAllDropdowns();
        return;
    }
    
    // Close all dropdowns first
    closeAllDropdowns();
    
    // Open the clicked dropdown
    dropdown.classList.add('active');
    trigger.classList.add('active');
    if (chevron) {
        chevron.style.transform = 'rotate(180deg)';
    }
    activeDropdown = dropdown;
}

// Add click event to dropdown triggers
dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown(this);
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown-trigger')) {
        closeAllDropdowns();
    }
});

// Prevent dropdown from closing when clicking inside
document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

// Close dropdowns with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activeDropdown) {
        closeAllDropdowns();
    }
});

// ===== MODAL FUNCTIONALITY =====
const modal = document.getElementById('signUpModal');
const closeModalBtn = document.getElementById('closeModal');

// Get all sign in and log in links
const dropdownSignInLinks = document.querySelectorAll('.dropdown-item.sign-in-link');
const dropdownLogInLinks = document.querySelectorAll('.dropdown-item.log-in-link');
const footerSignInLinks = document.querySelectorAll('.footer-section .footer-link');
const mainSigninLink = document.querySelectorAll('.log-in-button');

// Function to open modal
function openModal() {
    if (!modal) return;
    
    // Get the current scroll position
    const scrollY = window.scrollY;
    
    // Calculate scrollbar width before hiding overflow
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Apply styles to prevent layout shift and body scroll
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Close any open dropdowns
    closeAllDropdowns();
}

// Function to close modal
function closeModal() {
    if (!modal) return;
    
    // Get the scroll position that was saved
    const scrollY = document.body.style.top;
    
    // Remove the styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.paddingRight = '';
    
    // Hide modal
    modal.style.display = 'none';
    
    // Restore scroll position
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
}

// Open modal for dropdown Sign in links
dropdownSignInLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });
});

// Open modal for dropdown Log in links
dropdownLogInLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });
});

// Open modal for main sign in link
mainSigninLink.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });
});

// Open modal for footer Sign in and Log in links
footerSignInLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const linkText = link.textContent.trim().toLowerCase();
        // Check if it's "Sign in" or "Log in"
        if (linkText === 'sign in' || linkText === 'log in') {
            openModal();
        }
    });
});

// Close modal when X button is clicked
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function() {
        closeModal();
    });
}

// Close modal when clicking outside the modal content
if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
        closeModal();
    }
});

// ===== FOOTER NAVIGATION LINKS =====
// Get all footer links
const footerLinks = document.querySelectorAll('.footer-section .footer-link');

footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const linkText = this.textContent.trim().toLowerCase();
        
        // Handle navigation based on link text
        if (linkText === 'feedback form') {
            e.preventDefault();
            window.location.href = 'feedback.html';
        } else if (linkText === 'survey form') {
            e.preventDefault();
            window.location.href = 'survey.html';
        }
        // Sign in and Log in are already handled above in the modal section
    });
});