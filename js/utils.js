// Get modal elements
const modal = document.getElementById('signUpModal');
const signInBtn = document.getElementById('signInBtn');
const closeBtn = document.getElementById('closeModal');
const signInLink = document.querySelector('.sign-in-link');
const logInLink = document.querySelector('.log-in-link');

// Function to open modal
function openModal() {
    // Calculate scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Add padding to body to prevent shift
    document.body.style.paddingRight = scrollbarWidth + 'px';
    document.body.style.overflow = 'hidden';
    
    // Show modal
    modal.style.display = 'flex';
}

// Function to close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0px';
}

// Open modal when main Sign in button is clicked
signInBtn.addEventListener('click', openModal);

// Open modal when Quick Access Sign in link is clicked
signInLink.addEventListener('click', openModal);

// Open modal when Quick Access Log in link is clicked
logInLink.addEventListener('click', openModal);

// Close modal when X button is clicked
closeBtn.addEventListener('click', closeModal);

// Close modal when clicking outside the modal content
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
    }
});