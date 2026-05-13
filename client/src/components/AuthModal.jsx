import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/modal.css'; 

const AuthModal = () => {
  const { isModalOpen, closeModal, modalMode, setModalMode, signup, login, signInWithGoogle, logout, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  if (!isModalOpen) return null;

  if (modalMode === 'logout') {
    return (
      <div className="modal" style={{ display: 'flex' }} onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={closeModal} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <h2 className="modal-title">Sign Out</h2>
          <p className="modal-subtitle" style={{ marginBottom: '25px' }}>
            Are you sure you want to log out of <br/>
            <strong>{currentUser?.email}</strong>?
          </p>

          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <button 
              className="modal-continue-btn" 
              style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ddd' }}
              onClick={closeModal}
            >
              Cancel
            </button>
            <button 
              className="modal-continue-btn" 
              style={{ background: '#d32f2f' }}
              onClick={() => {
                logout();
                closeModal();
              }}
            >
              Yes, Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSignUp = modalMode === 'signup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp && !agreed) {
      return setError('You must agree to the Terms and Privacy Policy.');
    }

    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      closeModal();
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      closeModal();
    } catch (err) {
      setError('Failed to sign in with Google.');
    }
  };

  return (
    <div className="modal" style={{ display: 'flex' }} onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeModal} aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="modal-title">{isSignUp ? 'Sign up for free' : 'Welcome back'}</h2>
        <p className="modal-subtitle">
          {isSignUp ? 'Full access to save favorites and collections' : 'Log in to view your saved flowers'}
        </p>

        {error && <div className="modal-error-msg">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="modal-input"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="modal-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignUp && (
            <div className="terms-container">
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)} 
              />
              <label htmlFor="terms">
                I agree to the <Link to="/support" onClick={closeModal}>Terms of Service</Link> and <Link to="/support" onClick={closeModal}>Privacy Policy</Link>.
              </label>
            </div>
          )}

          <button type="submit" className="modal-continue-btn">
            {isSignUp ? 'Create Account' : 'Log In'}
          </button>

          <div className="modal-divider">
            <span>OR</span>
          </div>

          <button type="button" className="modal-google-btn" onClick={handleGoogleSignIn}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="modal-toggle-text">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={() => setModalMode(isSignUp ? 'login' : 'signup')}>
            {isSignUp ? 'Log in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;