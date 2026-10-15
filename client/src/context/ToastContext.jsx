import { useState, useCallback, useRef, useEffect } from 'react';
import { ToastContext } from './useToast';
import '../styles/Toast.css';

// Small, non-blocking confirmation messages (e.g. "Added to favorites"),
// used instead of a modal for quick actions.
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
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
        {toast && (
          <div key={toast.id} className={`toast toast-${toast.tone}`}>
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
};
