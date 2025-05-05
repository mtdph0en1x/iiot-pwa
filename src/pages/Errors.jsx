import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { errorData } from '../data/sampleData';
import SecondaryNavbar from '../components/SecondaryNavbar';

export default function Errors() {
  const [activeTab, setActiveTab] = useState('suggestedActions');

  return (
    <>
      <SecondaryNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="space-y-6 p-6">
        <h2 className="text-2xl font-bold mb-6">Errors & Alerts</h2>
        
        {/* Search Bar */}
        <div className="w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search devices..."
              className="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content based on selected tab */}
        {activeTab === 'suggestedActions' && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Suggested Actions</h3>
            <ul className="space-y-3">
              <li className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="font-medium">Check cooling system on Device E</p>
                <p className="text-sm text-gray-600 mt-1">Temperature has exceeded normal operating range (95°C)</p>
                <div className="mt-2">
                  <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition mr-2">
                    View Device
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                    Mark as Resolved
                  </button>
                </div>
              </li>
              <li className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="font-medium">Monitor temperature levels on Device C</p>
                <p className="text-sm text-gray-600 mt-1">Temperature approaching critical threshold (85°C)</p>
                <div className="mt-2">
                  <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition mr-2">
                    View Device
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                    Mark as Resolved
                  </button>
                </div>
              </li>
              <li className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="font-medium">Emergency maintenance required for Device E</p>
                <p className="text-sm text-gray-600 mt-1">Production stopped due to critical temperature (95°C)</p>
                <div className="mt-2">
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition mr-2">
                    Emergency Stop
                  </button>
                  <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition mr-2">
                    View Device
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                    Mark as Resolved
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
        
        {activeTab === 'deviceErrors' && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Device Errors List</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IoT Hub ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {errorData.map(error => (
                    <tr key={error.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{error.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.hubId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.uptime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.temperature}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.alertCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="px-3 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition">
                          {error.suggestedAction}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      
        {/* Error History Chart - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Error History</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { name: 'Mon', errors: 3 },
                  { name: 'Tue', errors: 2 },
                  { name: 'Wed', errors: 4 },
                  { name: 'Thu', errors: 1 },
                  { name: 'Fri', errors: 2 },
                  { name: 'Sat', errors: 0 },
                  { name: 'Sun', errors: 2 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="errors" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Error Resolution Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition">
                <span className="font-medium">Reset All Devices</span>
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">7 devices</span>
              </button>
              <button className="w-full flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100 transition">
                <span className="font-medium">Acknowledge All Alerts</span>
                <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">3 alerts</span>
              </button>
              <button className="w-full flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition">
                <span className="font-medium">Emergency Stop All Devices</span>
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">Critical</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}