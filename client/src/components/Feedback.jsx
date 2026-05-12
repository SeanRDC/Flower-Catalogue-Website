import { useEffect, useState } from 'react';
import '../styles/Feedback.css';

const Feedback = () => {
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    document.title = 'Feedback | Peony';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedbackText.trim()) {
      alert("Thank you for your feedback! We appreciate your thoughts.");
      setFeedbackText('');
    }
  };

  return (
    <div className="desktop-home-page">
      <div className="subpage-hero-header">
        <div className="vector-container">
          <img 
            className="vector" 
            src="https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1600&q=80" 
            alt="Header background" 
          />
          <svg className="wave-svg-clip">
            <defs>
              <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
                <path d="M 0,0 L 0,0.75 Q 0.125,0.85 0.25,0.75 Q 0.375,0.65 0.5,0.75 Q 0.625,0.85 0.75,0.75 Q 0.875,0.65 1,0.75 L 1,0 Z" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>

      <main className="feedback-content">
        <h1>Give us your Feedback</h1>
        <p className="description">
          Your thoughts help us grow and improve. Whether it's a quick suggestion, a bug report, or a brilliant idea, your feedback makes a difference. Tell us what's working, what's not, and what you'd love to see next.
        </p>
        
        <form className="feedback-form" onSubmit={handleSubmit}>
          <textarea 
            placeholder="Share your thoughts..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </main>
    </div>
  );
};

export default Feedback;