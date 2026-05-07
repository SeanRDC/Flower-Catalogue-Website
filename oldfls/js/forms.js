// ======== SURVEY SELECTION ============
const ratingButtons = document.querySelectorAll('.rating-btn');
const surveyForm = document.getElementById('surveyForm');
const responses = {};

// Handle rating button clicks
ratingButtons.forEach(button => {
    button.addEventListener('click', function() {
        const question = this.getAttribute('data-question');
        const value = this.getAttribute('data-value');
        
        // Remove selected class from all buttons in this question
        document.querySelectorAll(`[data-question="${question}"]`).forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selected class to clicked button
        this.classList.add('selected');
        
        // Store the response
        responses[question] = value;
    });
});

// Handle form submission
surveyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check if all questions are answered
    const totalQuestions = 8;
    if (Object.keys(responses).length < totalQuestions) {
        alert('Please answer all questions before submitting.');
        return;
    }
    
    // Get comments
    const comments = document.getElementById('comments').value;
    
    // Here you would normally send the data to a server
    console.log('Survey Responses:', responses);
    console.log('Comments:', comments);
    
    alert('Thank you for your feedback!');
    clearForm();
});

// Clear form function
function clearForm() {
    // Remove all selected classes
    ratingButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Clear textarea
    document.getElementById('comments').value = '';
    
    // Clear responses object
    for (let key in responses) {
        delete responses[key];
    }
}