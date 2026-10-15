import { useState, useEffect, useCallback } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { apiClient, setUnauthorizedHandler, TOKEN_KEY, USER_KEY } from '../api/client';
import { AuthContext } from './useAuth';

const loadSavedUser = () => {
  try {
    const savedUser = localStorage.getItem(USER_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);
    return savedUser && savedToken ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(loadSavedUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('login');
  const [alertContent, setAlertContent] = useState({ title: '', message: '' });

  const login = (userData, token) => {
    setCurrentUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, token);
  };

  const clearSession = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const logout = () => {
    clearSession();
    window.location.reload();
  };

  const openModal = (mode = 'login') => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  // The modal keeps its mode and content while it animates out; every way of
  // opening it sets the mode again, so nothing needs resetting here (a delayed
  // reset could also wipe an alert opened right after closing).
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showAlert = (title, message) => {
    setAlertContent({ title, message });
    openModal('alert');
  };

  // If the server rejects our token (expired or invalid), sign out locally
  // and ask the user to log in again.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      setModalMode('login');
      setIsModalOpen(true);
    });
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const signInWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await apiClient.post('/auth/google', { accessToken: tokenResponse.access_token });
        login(res.data.user, res.data.token);
        showAlert('Welcome!', 'Successfully logged in with Google.');
      } catch (error) {
        console.error('Google Sign-In Error:', error);
        showAlert('Sign-In Error', error.response?.data?.message || 'Failed to sync Google account with database.');
      }
    },
    onError: () => {
      showAlert('Sign-In Cancelled', 'Google login was cancelled or failed.');
    }
  });

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
      closeModal,
      showAlert,
      alertContent
    }}>
      {children}
    </AuthContext.Provider>
  );
};
