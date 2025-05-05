import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Server, Shield, Info, Settings, Database } from 'lucide-react';
import { deviceData, configOptions } from '../data/sampleData';
import SecondaryNavbar from '../components/SecondaryNavbar';

export default function UpdatedConfiguration() {
  const [pageTab, setPageTab] = useState('deviceList');
  
  // This needs to be separate from the tabbed interface we already have
  // We'll use this for the secondary navbar tabs
  const [secondaryTab, setSecondaryTab] = useState('deviceList');
  
  // Sync the secondary navbar tab with our page tab
  useEffect(() => {
    setPageTab(secondaryTab);
  }, [secondaryTab]);

  return (
    <>
      <SecondaryNavbar activeTab={secondaryTab} setActiveTab={setSecondaryTab} />
      
      <div className="space-y-6 p-6">
        <h2 className="text-2xl font-bold mb-6">Configuration</h2>

        {/* About This Solution section is always visible at the top */}
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h3 className="text-xl font-medium mb-4">About this solution:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Version</h4>
                <p className="mt-1 text-lg">2.5.3</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Client's Company Name</h4>
                <p className="mt-1 text-lg">Example Corporation</p>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Worker's ID</h4>
                <p className="mt-1 text-lg">WID-2024-0042</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Emergency Line</h4>
                <p className="mt-1 text-lg">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content based on the selected tab */}
        {pageTab === 'deviceList' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Device List</h3>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                Add New Device
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workorder ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deviceData.map(device => (
                    <tr key={device.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{device.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.workorderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          device.status === 'online' ? 'bg-green-100 text-green-800' :
                          device.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          device.status === 'error' ? 'bg-red-100 text-red-800' :
                          device.status === 'maintenance' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link 
                          to={`/device/${device.id}`} 
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          Configure
                        </Link>
                        <button className="text-red-600 hover:text-red-800">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pageTab === 'twinSettings' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-6">Device Twin Default Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Alert Thresholds</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature Warning (°C)
                    </label>
                    <input 
                      type="number" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
                      defaultValue={configOptions.alertThresholds.temperature.warning} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature Critical (°C)
                    </label>
                    <input 
                      type="number" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
                      defaultValue={configOptions.alertThresholds.temperature.critical} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Production Warning (units/hr)
                    </label>
                    <input 
                      type="number" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
                      defaultValue={configOptions.alertThresholds.production.warning} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Production Critical (units/hr)
                    </label>
                    <input 
                      type="number" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
                      defaultValue={configOptions.alertThresholds.production.critical} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Uptime Warning
                    </label>
                    <input 
                      type="text" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
                      defaultValue={configOptions.alertThresholds.uptime.warning} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Uptime Critical
                    </label>
                    <input 
                      type="text" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
                      defaultValue={configOptions.alertThresholds.uptime.critical} 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Maintenance Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maintenance Schedule
                    </label>
                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                      <option selected={configOptions.maintenance.schedule === 'Weekly'}>Weekly</option>
                      <option selected={configOptions.maintenance.schedule === 'Bi-weekly'}>Bi-weekly</option>
                      <option selected={configOptions.maintenance.schedule === 'Monthly'}>Monthly</option>
                      <option selected={configOptions.maintenance.schedule === 'Quarterly'}>Quarterly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Performed
                    </label>
                    <input 
                      type="date" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
                      defaultValue={configOptions.maintenance.lastPerformed} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next Scheduled
                    </label>
                    <input 
                      type="date" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
                      defaultValue={configOptions.maintenance.nextScheduled} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {pageTab === 'connections' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-6">Connection Settings</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">IoT Hub Connection</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IoT Hub Hostname
                    </label>
                    <input 
                      type="text" 
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
                      defaultValue="iothub-example.azure-devices.net" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IoT Hub Connection String
                    </label>
                    <div className="flex">
                      <input 
                        type="password" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
                        defaultValue="HostName=iothub-example.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=abcdefgh..." 
                      />
                      <button className="ml-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition">
                        Show
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Database Connection</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Database Type
                    </label>
                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                      <option>Azure Cosmos DB</option>
                      <option>Azure SQL Database</option>
                      <option>PostgreSQL</option>
                      <option>MySQL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Connection String
                    </label>
                    <div className="flex">
                      <input 
                        type="password" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" 
                        defaultValue="AccountEndpoint=https://example.documents.azure.com:443/;AccountKey=abcdefgh..." 
                      />
                      <button className="ml-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition">
                        Show
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Connection strings contain sensitive information. Make sure only authorized personnel have access to these settings.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                  Test Connection
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {pageTab === 'userAccess' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">User Access Policies</h3>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                Add New User
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">admin@example.com</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Administrator</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-05-04 15:32</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Disable</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">operator1@example.com</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Operator</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-05-05 09:15</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Disable</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">maintenance@example.com</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maintenance</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-05-03 14:22</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Disable</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">readonly@example.com</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Read Only</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-04-28 10:45</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                      <button className="text-green-600 hover:text-green-800">Enable</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-4">Role Permissions</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control Devices</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manage Users</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Configure System</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Administrator</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-green-600">✓</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Operator</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-red-600">✗</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Maintenance</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-red-600">✗</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Read Only</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-green-600">✓</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-red-600">✗</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}