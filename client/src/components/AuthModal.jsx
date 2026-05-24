import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/modal.css'; 

const AuthModal = () => {
  const { isModalOpen, closeModal, modalMode, setModalMode, login, signInWithGoogle, logout, currentUser, alertContent } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); 
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); 
  const [agreed, setAgreed] = useState(false);
  
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    let timer;
    if (showOtp && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && showOtp) {
      setError('OTP has expired. Please try again.');
    }
    return () => clearInterval(timer);
  }, [showOtp, timeLeft]);

  useEffect(() => {
    setError('');
    setSuccessMsg('');
    setShowOtp(false);
    setOtp('');
  }, [modalMode]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!isModalOpen) return null;

  if (modalMode === 'logout') {
    return (
      <div className="modal" style={{ display: 'flex' }} onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={closeModal}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <h2 className="modal-title">Sign Out</h2>
          <p className="modal-subtitle" style={{ marginBottom: '25px' }}>
            Are you sure you want to log out of <br/><strong>{currentUser?.email}</strong>?
          </p>
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <button className="modal-continue-btn" style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ddd' }} onClick={closeModal}>Cancel</button>
            <button className="modal-continue-btn" style={{ background: '#d32f2f', border: 'none' }} onClick={() => { logout(); closeModal(); }}>Yes, Log Out</button>
          </div>
        </div>
      </div>
    );
  }

  if (modalMode === 'alert') {
  return (
    <div className="modal" style={{ display: 'flex' }} onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeModal}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h2 className="modal-title">{alertContent.title}</h2>
        <p className="modal-subtitle" style={{ marginBottom: '25px' }}>
          {alertContent.message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button className="modal-continue-btn" style={{ width: '100%' }} onClick={closeModal}>OK</button>
        </div>
      </div>
    </div>
  );
}

  const isSignUp = modalMode === 'signup';
  const isForgotPw = modalMode === 'forgotPassword';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isSignUp && !agreed) return setError('You must agree to the Terms and Privacy Policy.');

    setIsLoading(true);
    try {
      if (isSignUp) {
        await axios.post('https://flower-catalogue-website.onrender.com/api/auth/send-otp', { email });
        setShowOtp(true);
        setTimeLeft(300);
      } else if (isForgotPw) {
        await axios.post('https://flower-catalogue-website.onrender.com/api/auth/forgot-password-otp', { email });
        setShowOtp(true);
        setTimeLeft(300);
      } else {
        const res = await axios.post('https://flower-catalogue-website.onrender.com/api/auth/login', { email, password });
        login(res.data.user, res.data.token); 
        closeModal();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (timeLeft === 0) return setError('OTP has expired.');
    
    setIsLoading(true);
    try {
      if (isForgotPw) {
        await axios.post('https://flower-catalogue-website.onrender.com/api/auth/reset-password', { email, otp, newPassword });
        setModalMode('login');
        setSuccessMsg('Password successfully reset! Please log in.');
      } else {
        const res = await axios.post('https://flower-catalogue-website.onrender.com/api/auth/verify-otp', { email, password, otp });
        login(res.data.user, res.data.token);
        closeModal();
      }
      setShowOtp(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {showOtp ? (
          <>
            <h2 className="modal-title">Check your email</h2>
            <p className="modal-subtitle" style={{ marginBottom: '15px' }}>
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
            
            <div style={{ textAlign: 'center', marginBottom: '20px', color: timeLeft <= 60 ? '#d32f2f' : '#5a6c3a', fontWeight: 'bold', fontSize: '18px' }}>
              {formatTime()}
            </div>

            {error && <div className="modal-error-msg">{error}</div>}
            
            <form className="modal-form" onSubmit={handleOtpSubmit}>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                className="modal-input otp-input"
                autoFocus
                required
                disabled={timeLeft === 0}
              />

              {isForgotPw && (
                <input 
                  type="password" 
                  className="modal-input" 
                  placeholder="Enter your new password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                  disabled={timeLeft === 0}
                />
              )}

              <button type="submit" className="modal-continue-btn" disabled={isLoading || otp.length < 6 || timeLeft === 0}>
                {isLoading ? 'Verifying...' : (isForgotPw ? 'Reset Password' : 'Verify & Create Account')}
              </button>
            </form>
            <p className="modal-toggle-text">
              <span onClick={() => { setShowOtp(false); setTimeLeft(300); }}>Go back</span>
            </p>
          </>
        ) : (
          <>
            <h2 className="modal-title">
              {isSignUp ? 'Sign up for free' : (isForgotPw ? 'Reset Password' : 'Welcome back')}
            </h2>
            <p className="modal-subtitle">
              {isSignUp ? 'Full access to save favorites and collections' : (isForgotPw ? 'Enter your email to receive a reset code' : 'Log in to view your saved flowers')}
            </p>

            {error && <div className="modal-error-msg">{error}</div>}
            {successMsg && <div className="modal-success-msg">{successMsg}</div>}

            <form className="modal-form" onSubmit={handleSubmit}>
              <input 
                type="email" 
                className="modal-input" 
                placeholder="Enter your email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              
              {!isForgotPw && (
                <div style={{ width: '100%', position: 'relative' }}>
                  <input 
                    type="password" 
                    className="modal-input" 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  {!isSignUp && !isForgotPw && (
                    <div className="forgot-pw-container">
                      <span className="forgot-pw-link" onClick={() => setModalMode('forgotPassword')}>
                        Forgot password?
                      </span>
                    </div>
                  )}
                </div>
              )}

              {isSignUp && (
                <div className="terms-container">
                  <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                  <label htmlFor="terms">
                    I agree to the <Link to="/support" onClick={closeModal}>Terms of Service</Link> and <Link to="/support" onClick={closeModal}>Privacy Policy</Link>.
                  </label>
                </div>
              )}

              <button type="submit" className="modal-continue-btn" disabled={isLoading}>
                {isLoading ? 'Loading...' : (isSignUp ? 'Create Account' : (isForgotPw ? 'Send Reset Code' : 'Log In'))}
              </button>

              {!isForgotPw && (
                <>
                  <div className="modal-divider"><span>OR</span></div>
                  <button type="button" className="modal-google-btn" onClick={handleGoogleSignIn}>
                    <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </button>
                </>
              )}
            </form>

            <p className="modal-toggle-text">
              {isForgotPw ? (
                <span onClick={() => { setModalMode('login'); setError(''); }}>Back to Log In</span>
              ) : (
                <>
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                  <span onClick={() => { setModalMode(isSignUp ? 'login' : 'signup'); setError(''); }}>
                    {isSignUp ? 'Log in' : 'Sign up'}
                  </span>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;