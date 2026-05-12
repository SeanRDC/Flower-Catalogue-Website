import { useState, useEffect } from 'react';
import '../styles/Survey.css';

const surveyQuestions = [
  { id: 'q1', text: "1. The website is easy to navigate." },
  { id: 'q2', text: "2. The design is visually appealing." },
  { id: 'q3', text: "3. Content is clear and informative." },
  { id: 'q4', text: "4. Pages load quickly and without errors." },
  { id: 'q5', text: "5. I feel confident using this website." },
  { id: 'q6', text: "6. I would recommend this website to others." },
  { id: 'q7', text: "7. I can easily find the information I'm looking for." },
  { id: 'q8', text: "8. The website meets my expectations." }
];

const Survey = () => {
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState('');

  useEffect(() => {
    document.title = 'Survey | Peony';
    window.scrollTo(0, 0);
  }, []);

  const handleRating = (questionId, value) => {
    setRatings({ ...ratings, [questionId]: value });
  };

  const handleClear = () => {
    setRatings({});
    setComments('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Survey submitted! Thank you for helping us improve Peony.");
    handleClear();
  };

  return (
    <div className="desktop-home-page short-header-page">
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

      <div className="survey-container">
        <div className="survey-intro">
          <h1>Help us improve by sharing your thoughts</h1>
          <p>This quick survey lets us know what's working, what needs attention, and how we can serve you better. Your feedback matters!</p>
        </div>

        <div className="survey-card">
          <div className="survey-title">
            <span>🌸</span>
            <h2>Peony User Survey</h2>
          </div>

          <div className="scale-info">1 = Strongly Disagree, 5 = Strongly Agree</div>

          <form onSubmit={handleSubmit}>
            {surveyQuestions.map((q) => (
              <div key={q.id} className="question">
                <div className="question-text">{q.text}</div>
                <div className="rating-buttons">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`rating-btn ${ratings[q.id] === val ? 'selected' : ''}`}
                      onClick={() => handleRating(q.id, val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="textarea-section">
              <label>Share your thoughts, we're listening!</label>
              <textarea 
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Your feedback helps us improve..."
              ></textarea>
            </div>

            <div className="form-buttons">
              <button type="button" className="btn btn-clear" onClick={handleClear}>Clear</button>
              <button type="submit" className="btn btn-submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Survey;