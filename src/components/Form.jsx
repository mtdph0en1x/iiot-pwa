import React from 'react';

/**
 * A reusable form component with consistent styling
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form content
 * @param {Function} props.onSubmit - Form submission handler
 * @param {string} props.submitLabel - Text for the submit button
 * @param {string} props.cancelLabel - Text for the cancel button
 * @param {Function} props.onCancel - Cancel button handler
 * @param {boolean} props.loading - Whether the form is in a loading state
 */
export default function Form({ 
  children, 
  onSubmit, 
  submitLabel = 'Submit', 
  cancelLabel = 'Cancel',
  onCancel, 
  loading = false 
}) {
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit && onSubmit(e);
      }}
      className="space-y-6"
    >
      {children}
      
      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
            disabled={loading}
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Processing...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

/**
 * Form field with label and consistent styling
 */
export function FormField({ 
  label, 
  htmlFor, 
  error, 
  required = false,
  children 
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Form section with title and description
 */
export function FormSection({ title, description, children }) {
  return (
    <div className="space-y-4">
      <div>
        {title && <h3 className="text-lg font-medium">{title}</h3>}
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}