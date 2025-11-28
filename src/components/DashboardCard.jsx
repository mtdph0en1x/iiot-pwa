import React from 'react';

export default function DashboardCard({ title, value, change, icon }) {
  // Determine if change is positive, negative, or neutral
  const isPositive = change && change.startsWith('+');
  const isNegative = change && change.startsWith('-');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <p className={`ml-2 text-sm font-medium ${
                isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
              }`}>
                {change}
              </p>
            )}
          </div>
        </div>
        <div className="p-2 bg-blue-50 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
}