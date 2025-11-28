import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SecondaryNavbar component 
 * 
 */
export default function SecondaryNavbar({ activeTab, setActiveTab }) {
  const location = useLocation();
  const path = location.pathname;

  // Define navigation items for each page
  const kpiNavItems = [
    { id: 'goodProduction', label: 'Good production rate' },
    { id: 'productionRate', label: 'Production Rate' },
    { id: 'failureFrequency', label: 'failure frequency' }
  ];

  const errorsNavItems = [
    { id: 'suggestedActions', label: 'Suggested actions list' },
    { id: 'deviceErrors', label: 'device errors list' }
  ];

  const configNavItems = [
    { id: 'deviceList', label: 'Device List' },
    { id: 'twinSettings', label: 'Twin Settings' },
    { id: 'connections', label: 'Connections' },
    { id: 'userAccess', label: 'User access policies' }
  ];

  const deviceDetailNavItems = [
    { id: 'temperature', label: 'temperature' },
    { id: 'productionRate', label: 'production rate' },
    { id: 'status', label: 'Status' }
  ];

  // Determine which nav items to display based on current route
  let navItems = [];
  if (path.startsWith('/kpi')) {
    navItems = kpiNavItems;
  } else if (path.startsWith('/errors')) {
    navItems = errorsNavItems;
  } else if (path.startsWith('/configuration')) {
    navItems = configNavItems;
  } else if (path.startsWith('/device/')) {
    navItems = deviceDetailNavItems;
  } else {
    return null; // Don't show secondary navbar on other pages
  }

  // If no activeTab is set, but items exist, default to the first item
  if (activeTab === undefined && navItems.length > 0) {
    setActiveTab(navItems[0].id);
  }

  if (navItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-500 text-white">
      <div className="container mx-auto px-4 py-0">
        <div className="flex flex-wrap">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-6 py-3 text-sm font-medium hover:bg-blue-600 transition flex-1 text-center ${
                activeTab === item.id ? 'bg-blue-600' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}