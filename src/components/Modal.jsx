import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Modal component for dialogs, forms, and alerts
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Function to call when the modal should close
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size (sm, md, lg, xl)
 * @param {boolean} props.showCloseButton - Whether to show the close button in the header
 */
export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}) {
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Determine modal width based on size prop
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">{title}</h3>
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Modal footer component with action buttons
 */
export function ModalFooter({ 
  primaryAction, 
  primaryLabel = 'Confirm', 
  secondaryAction, 
  secondaryLabel = 'Cancel',
  dangerAction,
  dangerLabel = 'Delete',
  primaryDisabled = false,
  secondaryDisabled = false,
  dangerDisabled = false
}) {
  return (
    <div className="flex justify-end space-x-2 pt-4 mt-6 border-t border-gray-200">
      {secondaryAction && (
        <button
          type="button"
          onClick={secondaryAction}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
          disabled={secondaryDisabled}
        >
          {secondaryLabel}
        </button>
      )}
      
      {dangerAction && (
        <button
          type="button"
          onClick={dangerAction}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          disabled={dangerDisabled}
        >
          {dangerLabel}
        </button>
      )}
      
      {primaryAction && (
        <button
          type="button"
          onClick={primaryAction}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={primaryDisabled}
        >
          {primaryLabel}
        </button>
      )}
    </div>
  );
}