import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContext } from './useToast';
import { toastMotion, useMotionPreset } from '../utils/motion';
import '../styles/Toast.css';

// Small, non-blocking confirmation messages (e.g. "Added to favorites"),
// used instead of a modal for quick actions.
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const toastAnimation = useMotionPreset(toastMotion);
  const timerRef = useRef(null);

  const showToast = useCallback((message, tone = 'success') => {
    clearTimeout(timerRef.current);
    setToast({ message, tone, id: Date.now() });
    timerRef.current = setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div key={toast.id} className={`toast toast-${toast.tone}`} {...toastAnimation}>
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
