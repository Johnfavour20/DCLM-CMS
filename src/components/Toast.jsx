import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 p-4 rounded-md shadow-lg text-white ${typeStyles[type]}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200 focus:outline-none">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;