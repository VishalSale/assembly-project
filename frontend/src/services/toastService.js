import { toast } from 'react-toastify';
import { UI_MESSAGES } from '../constants';

// Check if device is mobile
const isMobile = () => window.innerWidth <= 768;

// Toast configuration
const getToastConfig = (options = {}) => ({
  position: "top-right",
  autoClose: isMobile() ? 2500 : 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: !isMobile(), // Don't pause on hover for mobile
  draggable: true,
  ...options
});

// Success toast
export const showSuccess = (message, options = {}) => {
  toast.success(message, getToastConfig(options));
};

// Error toast
export const showError = (message, options = {}) => {
  const errorConfig = {
    autoClose: isMobile() ? 3000 : 7000, // Slightly longer for errors
    ...options
  };
  toast.error(message, getToastConfig(errorConfig));
};

// Warning toast
export const showWarning = (message, options = {}) => {
  toast.warning(message, getToastConfig(options));
};

// Info toast
export const showInfo = (message, options = {}) => {
  const infoConfig = {
    autoClose: isMobile() ? 2000 : 4000, // Shorter for info messages
    ...options
  };
  toast.info(message, getToastConfig(infoConfig));
};

// Loading toast (returns toast id for updating)
export const showLoading = (message, options = {}) => {
  return toast.loading(message, getToastConfig(options));
};

// Update existing toast
export const updateToast = (toastId, type, message, options = {}) => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    ...getToastConfig(options)
  });
};

// Dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Custom toast for authentication
export const showAuthError = (message) => {
  showError(message, {
    toastId: 'auth-error', // Prevent duplicate auth error toasts
    autoClose: isMobile() ? 3500 : 8000
  });
};

// Custom toast for network errors
export const showNetworkError = (message = UI_MESSAGES.ERROR.NETWORK_ERROR) => {
  showError(message, {
    toastId: 'network-error',
    autoClose: isMobile() ? 3500 : 8000
  });
};

// Custom toast for session expiry
export const showSessionExpired = () => {
  showWarning(UI_MESSAGES.ERROR.SESSION_EXPIRED, {
    toastId: 'session-expired',
    autoClose: isMobile() ? 4000 : 8000
  });
};