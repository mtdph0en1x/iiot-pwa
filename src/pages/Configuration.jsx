import React, { useState } from 'react';
import { Power, Shield } from 'lucide-react';
import Alert from "../components/Alert"
import { deviceData } from '../data/sampleData';

export default function Configuration() {
  const [activeTab, setActiveTab] = useState('deviceList');
  const [alerts, setAlerts] = useState([]);
  
  // Configuration options (would normally be imported from sampleData.js)
  const configOptions = {
    alertThresholds: {
      temperature: {
        warning: 80,
        critical: 90,
      },
      uptime: {
        warning: '30d',
        critical: '45d',
      },
      production: {
        warning: 40,
        critical: 30,
      },
    },
    maintenance: {
      schedule: 'Monthly',
      lastPerformed: '2025-04-15',
      nextScheduled: '2025-05-15',
    },
  };
  
  // Function to add an alert
  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const handleSaveSettings = () => {
    addAlert('success', 'Settings saved successfully!');
  };

  const handleTestConnection = () => {
    addAlert('warning', 'Database connection is experiencing high latency!');
  };

  const handleEmergencyStop = () => {
    addAlert('error', 'Emergency stop triggered for all devices!');
  };

  return (
    <div className="space-y-6">
      {/* Display all active alerts */}
      <div className="space-y-2">
        {alerts.map(alert => (
          <Alert
            key={alert.id} 
            type={alert.type} 
            message={alert.message} 
            onClose={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
          />
        ))}
      </div>
      
      <h1 className="text-2xl font-bold font-['Roboto_Slab'] mb-6">Configuration</h1>
      
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`py-3 px-6 font-medium ${activeTab === 'deviceList' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('deviceList')}
        >
          Device List
        </button>
        <button 
          className={`py-3 px-6 font-medium ${activeTab === 'twinSettings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('twinSettings')}
        >
          Twin Settings
        </button>
        <button 
          className={`py-3 px-6 font-medium ${activeTab === 'connections' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('connections')}
        >
          Connections
        </button>
        <button 
          className={`py-3 px-6 font-medium ${activeTab === 'userAccess' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('userAccess')}
        >
          User Access Policies
        </button>
      </div>

      {/* About This Solution - Always visible */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-medium mb-4">About this solution</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Version</h3>
            <p className="text-lg">1.4.2</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Client's Company Name</h3>
            <p className="text-lg">IndustrialTech Solutions</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Worker's ID</h3>
            <p className="text-lg">WID-2025-001</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <Shield className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-red-800">Emergency Line</h3>
              <p className="text-sm text-red-700">+1 (555) 123-4567</p>
              <p className="text-xs text-red-600 mt-1">Available 24/7 for critical issues</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content based on active tab */}
      {activeTab === 'deviceList' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Device List</h2>
            <div className="flex space-x-2">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => addAlert('success', 'New device added successfully!')}
              >
                Add New Device
              </button>
              <button 
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleEmergencyStop}
              >
                <Power size={16} className="mr-2" />
                Emergency Stop
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IoT Hub ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workorder ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deviceData.slice(0, 5).map((device) => (
                  <tr key={device.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{device.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.hubId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.workorderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.temperature}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.productionRate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        device.status === 'online' ? 'bg-green-100 text-green-800' : 
                        device.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                        device.status === 'error' ? 'bg-red-100 text-red-800' : 
                        device.status === 'maintenance' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <span className={`w-2 h-2 mr-1 rounded-full ${
                          device.status === 'online' ? 'bg-green-600' : 
                          device.status === 'warning' ? 'bg-yellow-600' : 
                          device.status === 'error' ? 'bg-red-600' : 'bg-gray-600'
                        }`}></span>
                        {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition">Configure</button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition">Reset</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'twinSettings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-xl font-medium mb-4">Twin Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Production Rate Threshold</label>
                <input type="range" min="0" max="100" className="w-full" defaultValue="80" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature Warning Level</label>
                <input type="range" min="0" max="100" className="w-full" defaultValue="75" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0°C</span>
                  <span>50°C</span>
                  <span>100°C</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Alert Thresholds</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Temperature</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm text-gray-500">Warning</label>
                      <input 
                        type="text" 
                        defaultValue={`${configOptions.alertThresholds.temperature.warning}°C`} 
                        className="w-full border rounded-md px-3 py-2" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Critical</label>
                      <input 
                        type="text" 
                        defaultValue={`${configOptions.alertThresholds.temperature.critical}°C`} 
                        className="w-full border rounded-md px-3 py-2" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Uptime</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm text-gray-500">Warning</label>
                      <input 
                        type="text" 
                        defaultValue={configOptions.alertThresholds.uptime.warning} 
                        className="w-full border rounded-md px-3 py-2" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Critical</label>
                      <input 
                        type="text" 
                        defaultValue={configOptions.alertThresholds.uptime.critical} 
                        className="w-full border rounded-md px-3 py-2" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Production</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm text-gray-500">Warning</label>
                      <input 
                        type="text" 
                        defaultValue={`${configOptions.alertThresholds.production.warning} units/hr`}  
                        className="w-full border rounded-md px-3 py-2" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Critical</label>
                      <input 
                        type="text" 
                        defaultValue={`${configOptions.alertThresholds.production.critical} units/hr`} 
                        className="w-full border rounded-md px-3 py-2" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleSaveSettings}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'connections' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-xl font-medium mb-4">Connections</h2>
            
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">IoT Hub Connection</h3>
                    <p className="text-sm text-gray-500">Connection string to your Azure IoT Hub</p>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                      <span className="w-2 h-2 mr-1 rounded-full bg-green-600"></span>
                      Connected
                    </span>
                    <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition">Configure</button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Event Hub Connection</h3>
                    <p className="text-sm text-gray-500">Connection to Azure Event Hub for event processing</p>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                      <span className="w-2 h-2 mr-1 rounded-full bg-green-600"></span>
                      Connected
                    </span>
                    <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition">Configure</button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Database Connection</h3>
                    <p className="text-sm text-gray-500">Connection to storage database</p>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                      <span className="w-2 h-2 mr-1 rounded-full bg-yellow-600"></span>
                      Warning
                    </span>
                    <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition">Configure</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleTestConnection}
              >
                Test All Connections
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'userAccess' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-xl font-medium mb-4">User Access Policies</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Access</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { user: 'admin@example.com', role: 'Administrator', access: 'All Devices', lastLogin: '2025-05-05 09:45' },
                    { user: 'tech@example.com', role: 'Technician', access: 'Device A, Device B', lastLogin: '2025-05-04 14:20' },
                    { user: 'operator@example.com', role: 'Operator', access: 'Device C', lastLogin: '2025-05-03 11:30' },
                    { user: 'viewer@example.com', role: 'Viewer', access: 'All Devices (Read Only)', lastLogin: '2025-04-29 16:15' },
                  ].map((user, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.access}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button 
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
                            onClick={() => addAlert('success', `User ${user.user} edited successfully!`)}
                          >
                            Edit
                          </button>
                          <button 
                            className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
                            onClick={() => addAlert('error', `User ${user.user} removed!`)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => addAlert('success', 'New user added successfully!')}
              >
                Add New User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}