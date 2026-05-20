import { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('peony_user');
    const savedToken = localStorage.getItem('peony_token');
    
    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setCurrentUser(userData);
    localStorage.setItem('peony_user', JSON.stringify(userData));
    localStorage.setItem('peony_token', token);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('peony_user');
    localStorage.removeItem('peony_token');
    window.location.reload(); 
  };

  const openModal = (mode = 'login') => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalMode('login'), 300); 
  };

  const signInWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const email = userInfo.data.email;

        const res = await axios.post('https://flower-catalogue-website.onrender.com/api/auth/google', { email });
        
        login(res.data.user, res.data.token);
      } catch (error) {
        console.error('Google Sign-In Error:', error);
        alert('Failed to sync Google account with database.');
      }
    },
    onError: () => {
      console.log('Google Login Failed');
      alert('Google login was cancelled or failed.');
    }
});

  if (loading) return null; 

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      signInWithGoogle,
      isModalOpen, 
      modalMode, 
      setModalMode,
      openModal, 
      closeModal 
    }}>
      {children}
    </AuthContext.Provider>
  );
};