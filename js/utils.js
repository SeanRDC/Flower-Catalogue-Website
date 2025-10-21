// Get modal elements
const modal = document.getElementById('signUpModal');
const signInBtn = document.getElementById('signInBtn');
const closeBtn = document.getElementById('closeModal');
const footerSignInLink = document.querySelector('.footer-sign-in-link');
const footerLogInLink = document.querySelector('.footer-log-in-link');
const dropdownSignInLinks = document.querySelectorAll('.dropdown-item.sign-in-link');
const dropdownLogInLinks = document.querySelectorAll('.dropdown-item.log-in-link');

// Get dropdown elements
const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
let activeDropdown = null;

// Function to open modal
function openModal() {
    // Get the current scroll position
    const scrollY = window.scrollY;
    
    // Calculate scrollbar width before hiding overflow
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Apply styles to prevent layout shift
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    // Show modal
    modal.style.display = 'flex';
}

// Function to close modal
function closeModal() {
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
    const dropdownId = trigger.getAttribute('data-dropdown');
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
    chevron.style.transform = 'rotate(180deg)';
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

// Open modal when main Sign in button is clicked
if (signInBtn) {
    signInBtn.addEventListener('click', openModal);
}

// Open modal when footer Quick Access Sign in link is clicked
if (footerSignInLink) {
    footerSignInLink.addEventListener('click', openModal);
}

// Open modal when footer Quick Access Log in link is clicked
if (footerLogInLink) {
    footerLogInLink.addEventListener('click', openModal);
}

// Open modal when dropdown Sign in links are clicked
dropdownSignInLinks.forEach(link => {
    link.addEventListener('click', function() {
        closeAllDropdowns();
        openModal();
    });
});

// Open modal when dropdown Log in links are clicked
dropdownLogInLinks.forEach(link => {
    link.addEventListener('click', function() {
        closeAllDropdowns();
        openModal();
    });
});

// Close modal when X button is clicked
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
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
    if (e.key === 'Escape') {
        if (modal && modal.style.display === 'flex') {
            closeModal();
        } else if (activeDropdown) {
            closeAllDropdowns();
        }
    }
});