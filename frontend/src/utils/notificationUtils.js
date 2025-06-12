import { toast } from 'react-toastify';

export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showWarning = (message) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showLoading = (message) => {
  return toast.loading(message, {
    position: "top-right",
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
  });
};

export const updateToast = (toastId, message, type = 'success') => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};

// Custom notification component for complex messages
export const showCustomNotification = ({ title, message, type = 'info', duration = 3000 }) => {
  const content = (
    <div>
      {title && <h4 style={{ margin: '0 0 8px 0' }}>{title}</h4>}
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );

  const options = {
    position: "top-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  switch (type) {
    case 'success':
      toast.success(content, options);
      break;
    case 'error':
      toast.error(content, options);
      break;
    case 'warning':
      toast.warning(content, options);
      break;
    default:
      toast.info(content, options);
  }
};

// Notification for API errors
export const showApiError = (error) => {
  const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
  showError(message);
};

// Notification for form validation errors
export const showValidationErrors = (errors) => {
  Object.values(errors).forEach(error => {
    if (typeof error === 'string') {
      showError(error);
    } else if (Array.isArray(error)) {
      error.forEach(err => showError(err));
    }
  });
}; 