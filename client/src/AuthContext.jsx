import { createContext, useContext, useState, useEffect } from 'react';

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

  const signInWithGoogle = async () => {
    console.log("Google Sign-In triggered!");
    // We will implement the actual Google popup logic here shortly
  };

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