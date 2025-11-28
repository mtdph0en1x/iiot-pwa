import React from 'react';

export default function StatusBadge({ status }) {
  // Define colors and text based on status
  const statusConfig = {
    online: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Online'
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Warning'
    },
    error: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Error'
    },
    offline: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Offline'
    },
    maintenance: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Maintenance'
    }
  };

  // Default to offline if status is not recognized
  const config = statusConfig[status] || statusConfig.offline;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 mr-1 rounded-full ${status === 'online' ? 'bg-green-600' : status === 'warning' ? 'bg-yellow-600' : status === 'error' ? 'bg-red-600' : 'bg-gray-600'}`}></span>
      {config.label}
    </span>
  );
}