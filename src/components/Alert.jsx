import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * 
 * 
 * @param {Object} props
 * @param {string} props.type - The type of alert: "error", "success", or "warning"
 * @param {string} props.message - Optional additional message to display
 * @param {Function} props.onClose - Optional callback when the alert is closed
 */
export default function Alert({ type, message, onClose }) {
  // Define styling based on type
  const styles = {
    error: {
      bg: 'bg-red-500',
      icon: <AlertCircle className="w-6 h-6 text-white mr-2" />,
      text: 'text-white',
      label: 'Error detected!'
    },
    success: {
      bg: 'bg-green-500',
      icon: <CheckCircle className="w-6 h-6 text-white mr-2" />,
      text: 'text-white',
      label: 'Success!'
    },
    warning: {
      bg: 'bg-yellow-400',
      icon: <AlertTriangle className="w-6 h-6 text-white mr-2" />,
      text: 'text-white',
      label: 'Warning!'
    }
  };

  const style = styles[type] || styles.error;
  
  return (
    <div className={`${style.bg} w-full p-4 flex items-center justify-center rounded-none`}>
      {style.icon}
      <span className={`font-bold ${style.text}`}>
        {style.label}
      </span>
      {message && (
        <span className={`ml-2 ${style.text}`}>{message}</span>
      )}
      {onClose && (
        <button 
          onClick={onClose} 
          className="ml-auto text-white hover:text-gray-200"
        >
          ✕
        </button>
      )}
    </div>
  );
}