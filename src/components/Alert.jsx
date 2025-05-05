import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

/**
 * Alert component to display feedback messages
 * 
 * @param {Object} props
 * @param {string} props.type - One of: 'success', 'error', 'warning', 'info'
 * @param {string} props.title - Alert title
 * @param {React.ReactNode} props.children - Alert content
 * @param {boolean} props.dismissible - Whether the alert can be dismissed
 * @param {Function} props.onDismiss - Function to call when the alert is dismissed
 */
export default function Alert({ 
  type = 'info', 
  title, 
  children, 
  dismissible = false, 
  onDismiss 
}) {
  // Determine the style based on the type
  const styles = {
    success: {
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      bg: 'bg-green-50',
      border: 'border-green-400',
      titleColor: 'text-green-800',
      textColor: 'text-green-700',
      closeHover: 'hover:bg-green-100'
    },
    error: {
      icon: <XCircle className="h-5 w-5 text-red-400" />,
      bg: 'bg-red-50',
      border: 'border-red-400',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
      closeHover: 'hover:bg-red-100'
    },
    warning: {
      icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700',
      closeHover: 'hover:bg-yellow-100'
    },
    info: {
      icon: <Info className="h-5 w-5 text-blue-400" />,
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700',
      closeHover: 'hover:bg-blue-100'
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`rounded-md p-4 ${style.bg} border-l-4 ${style.border}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {style.icon}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${style.titleColor}`}>{title}</h3>
          )}
          <div className={`text-sm ${style.textColor} mt-1`}>
            {children}
          </div>
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 ${style.bg} ${style.textColor} ${style.closeHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-600`}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}