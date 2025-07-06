import React, { useState } from 'react';
import { Power, Shield, X, Plus, Settings, Database, Users, Network } from 'lucide-react';
import Alert from "../components/Alert";
import Modal, { ModalFooter } from "../components/Modal";
import Form, { FormField, FormSection } from "../components/Form";
import { deviceData } from '../data/sampleData';

export default function Configuration() {
  const [activeTab, setActiveTab] = useState('deviceList');
  const [alerts, setAlerts] = useState([]);
  
  // Modal states
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showConfigureDeviceModal, setShowConfigureDeviceModal] = useState(false);
  const [showConfigureConnectionModal, setShowConfigureConnectionModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  // Form states
  const [deviceForm, setDeviceForm] = useState({
    name: '',
    hubId: '',
    workorderId: '',
    location: '',
    deviceType: 'sensor',
    status: 'offline'
  });
  
  const [connectionForm, setConnectionForm] = useState({
    name: '',
    type: 'iot-hub',
    connectionString: '',
    status: 'disconnected',
    timeout: '30',
    retryAttempts: '3'
  });
  
  const [userForm, setUserForm] = useState({
    email: '',
    role: 'viewer',
    deviceAccess: 'read-only',
    firstName: '',
    lastName: '',
    department: ''
  });
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Configuration options
  const configOptions = {
    alertThresholds: {
      temperature: { warning: 80, critical: 90 },
      uptime: { warning: '30', critical: '45' },
      production: { warning: 40, critical: 30 }
    },
    maintenance: {
      schedule: 'Monthly',
      lastPerformed: '2025-04-15',
      nextScheduled: '2025-05-15'
    }
  };

  const [twinSettings, setTwinSettings] = useState({
    temperatureWarning: configOptions.alertThresholds.temperature.warning,
    temperatureCritical: configOptions.alertThresholds.temperature.critical,
    uptimeWarning: configOptions.alertThresholds.uptime.warning,
    uptimeCritical: configOptions.alertThresholds.uptime.critical,
    productionWarning: configOptions.alertThresholds.production.warning,
    productionCritical: configOptions.alertThresholds.production.critical,
  });
  
  // Function to add an alert
  const addAlert = (type, message) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  // Form validation
  const validateDeviceForm = () => {
    const errors = {};
    if (!deviceForm.name.trim()) errors.name = 'Device name is required';
    if (!deviceForm.hubId.trim()) errors.hubId = 'Hub ID is required';
    if (!deviceForm.workorderId.trim()) errors.workorderId = 'Work order ID is required';
    return errors;
  };

  const validateConnectionForm = () => {
    const errors = {};
    if (!connectionForm.name.trim()) errors.name = 'Connection name is required';
    if (!connectionForm.connectionString.trim()) errors.connectionString = 'Connection string is required';
    return errors;
  };

  const validateUserForm = () => {
    const errors = {};
    if (!userForm.email.trim()) errors.email = 'Email is required';
    if (!userForm.firstName.trim()) errors.firstName = 'First name is required';
    if (!userForm.lastName.trim()) errors.lastName = 'Last name is required';
    if (userForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    return errors;
  };

  // Form handlers
  const handleAddDevice = async (e) => {
    e.preventDefault();
    const errors = validateDeviceForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addAlert('success', `Device ${deviceForm.name} added successfully!`);
    setShowAddDeviceModal(false);
    setDeviceForm({ name: '', hubId: '', workorderId: '', location: '', deviceType: 'sensor', status: 'offline' });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleConfigureDevice = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addAlert('success', `Device ${selectedDevice?.name} configured successfully!`);
    setShowConfigureDeviceModal(false);
    setIsSubmitting(false);
  };

  const handleConfigureConnection = async (e) => {
    e.preventDefault();
    const errors = validateConnectionForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addAlert('success', `Connection ${connectionForm.name} configured successfully!`);
    setShowConfigureConnectionModal(false);
    setConnectionForm({ name: '', type: 'iot-hub', connectionString: '', status: 'disconnected', timeout: '30', retryAttempts: '3' });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const errors = validateUserForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addAlert('success', `User ${userForm.email} added successfully!`);
    setShowAddUserModal(false);
    setUserForm({ email: '', role: 'viewer', deviceAccess: 'read-only', firstName: '', lastName: '', department: '' });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const errors = validateUserForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addAlert('success', `User ${userForm.email} updated successfully!`);
    setShowEditUserModal(false);
    setFormErrors({});
    setIsSubmitting(false);
  };

  // Modal open handlers
  const openConfigureDevice = (device) => {
    setSelectedDevice(device);
    setShowConfigureDeviceModal(true);
  };

  const openEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      email: user.user,
      role: user.role,
      deviceAccess: user.access,
      firstName: user.user.split('@')[0],
      lastName: '',
      department: ''
    });
    setShowEditUserModal(true);
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
        {[
          { id: 'deviceList', label: 'Device List', icon: <Settings size={16} /> },
          { id: 'twinSettings', label: 'Twin Settings', icon: <Database size={16} /> },
          { id: 'connections', label: 'Connections', icon: <Network size={16} /> },
          { id: 'userAccess', label: 'User Access Policies', icon: <Users size={16} /> }
        ].map(tab => (
          <button 
            key={tab.id}
            className={`flex items-center py-3 px-6 font-medium transition ${
              activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </button>
        ))}
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

      {/* Device List Tab */}
      {activeTab === 'deviceList' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Device List</h2>
            <div className="flex space-x-2">
              <button 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={() => setShowAddDeviceModal(true)}
              >
                <Plus size={16} className="mr-2" />
                Add New Device
              </button>
              <button 
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
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
                        <button 
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
                          onClick={() => openConfigureDevice(device)}
                        >
                          Configure
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition">
                          Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Twin Settings Tab */}
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
                      <label className="block text-sm text-gray-500">Warning (°C)</label>
                      <input 
                        type="number" 
                        value={twinSettings.temperatureWarning} 
                        onChange={(e) => setTwinSettings({...twinSettings, temperatureWarning: e.target.value})}
                        className="w-full border rounded-md px-3 py-2" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Critical (°C)</label>
                      <input 
                        type="number" 
                        value={twinSettings.temperatureCritical} 
                        onChange={(e) => setTwinSettings({...twinSettings, temperatureCritical: e.target.value})}
                        className="w-full border rounded-md px-3 py-2" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Uptime</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm text-gray-500">Warning (days)</label>
                      <input 
                        type="text" 
                        value={twinSettings.uptimeWarning} 
                        onChange={(e) => setTwinSettings({...twinSettings, uptimeWarning: e.target.value})}
                        className="w-full border rounded-md px-3 py-2" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Critical (days)</label>
                      <input 
                        type="text" 
                        value={twinSettings.uptimeCritical} 
                        onChange={(e) => setTwinSettings({...twinSettings, uptimeCritical: e.target.value})}
                        className="w-full border rounded-md px-3 py-2" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Production</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm text-gray-500">Warning (units/hr)</label>
                      <input 
                        type="number" 
                        value={twinSettings.productionWarning} 
                        onChange={(e) => setTwinSettings({...twinSettings, productionWarning: e.target.value})}
                        className="w-full border rounded-md px-3 py-2" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Critical (units/hr)</label>
                      <input 
                        type="number" 
                        value={twinSettings.productionCritical} 
                        onChange={(e) => setTwinSettings({...twinSettings, productionCritical: e.target.value})}
                        className="w-full border rounded-md px-3 py-2" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={handleSaveSettings}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-xl font-medium mb-4">Connections</h2>
            
            <div className="space-y-4">
              {[
                { name: 'IoT Hub Connection', description: 'Connection string to your Azure IoT Hub', status: 'Connected' },
                { name: 'Event Hub Connection', description: 'Connection to Azure Event Hub for event processing', status: 'Connected' },
                { name: 'Database Connection', description: 'Connection to storage database', status: 'Warning' }
              ].map((connection, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{connection.name}</h3>
                      <p className="text-sm text-gray-500">{connection.description}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                        connection.status === 'Connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <span className={`w-2 h-2 mr-1 rounded-full ${
                          connection.status === 'Connected' ? 'bg-green-600' : 'bg-yellow-600'
                        }`}></span>
                        {connection.status}
                      </span>
                      <button 
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
                        onClick={() => setShowConfigureConnectionModal(true)}
                      >
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={handleTestConnection}
              >
                Test All Connections
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Access Policies Tab */}
      {activeTab === 'userAccess' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">User Access Policies</h2>
              <button 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={() => setShowAddUserModal(true)}
              >
                <Plus size={16} className="mr-2" />
                Add New User
              </button>
            </div>
            
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
                            onClick={() => openEditUser(user)}
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
          </div>
        </div>
      )}

      {/* Add Device Modal */}
      <Modal 
        isOpen={showAddDeviceModal} 
        onClose={() => setShowAddDeviceModal(false)} 
        title="Add New Device"
        size="lg"
      >
        <Form onSubmit={handleAddDevice} loading={isSubmitting}>
          <FormSection title="Device Information" description="Basic device configuration">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Device Name" htmlFor="deviceName" required error={formErrors.name}>
                <input
                  id="deviceName"
                  type="text"
                  value={deviceForm.name}
                  onChange={(e) => setDeviceForm({...deviceForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Device A1"
                />
              </FormField>
              
              <FormField label="Device Type" htmlFor="deviceType" required>
                <select
                  id="deviceType"
                  value={deviceForm.deviceType}
                  onChange={(e) => setDeviceForm({...deviceForm, deviceType: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sensor">Sensor</option>
                  <option value="actuator">Actuator</option>
                  <option value="controller">Controller</option>
                  <option value="gateway">Gateway</option>
                </select>
              </FormField>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="IoT Hub ID" htmlFor="hubId" required error={formErrors.hubId}>
                <input
                  id="hubId"
                  type="text"
                  value={deviceForm.hubId}
                  onChange={(e) => setDeviceForm({...deviceForm, hubId: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., HUB-001"
                />
              </FormField>
              
              <FormField label="Work Order ID" htmlFor="workorderId" required error={formErrors.workorderId}>
                <input
                  id="workorderId"
                  type="text"
                  value={deviceForm.workorderId}
                  onChange={(e) => setDeviceForm({...deviceForm, workorderId: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., WO-2025-001"
                />
              </FormField>
            </div>
            
            <FormField label="Location" htmlFor="location">
              <input
                id="location"
                type="text"
                value={deviceForm.location}
                onChange={(e) => setDeviceForm({...deviceForm, location: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Factory Floor A, Section 3"
              />
            </FormField>
            
            <FormField label="Initial Status" htmlFor="status" required>
              <select
                id="status"
                value={deviceForm.status}
                onChange={(e) => setDeviceForm({...deviceForm, status: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </FormField>
          </FormSection>
        </Form>
      </Modal>

      {/* Configure Device Modal */}
      <Modal 
        isOpen={showConfigureDeviceModal} 
        onClose={() => setShowConfigureDeviceModal(false)} 
        title={`Configure ${selectedDevice?.name || 'Device'}`}
        size="lg"
      >
        <Form onSubmit={handleConfigureDevice} loading={isSubmitting}>
          <FormSection title="Device Configuration" description="Advanced device settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Temperature Threshold (°C)" htmlFor="tempThreshold">
                <input
                  id="tempThreshold"
                  type="number"
                  min="0"
                  max="200"
                  defaultValue="85"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormField>
              
              <FormField label="Production Rate Target" htmlFor="productionTarget">
                <input
                  id="productionTarget"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue="60"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormField>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Sampling Interval (seconds)" htmlFor="samplingInterval">
                <select
                  id="samplingInterval"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                </select>
              </FormField>
              
              <FormField label="Alert Level" htmlFor="alertLevel">
                <select
                  id="alertLevel"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </FormField>
            </div>
            
            <FormField label="Maintenance Schedule" htmlFor="maintenanceSchedule">
              <select
                id="maintenanceSchedule"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </FormField>
            
            <div className="flex items-center space-x-2">
              <input
                id="autoRestart"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoRestart" className="text-sm font-medium text-gray-700">
                Enable automatic restart on error
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="enableAlerts"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableAlerts" className="text-sm font-medium text-gray-700">
                Enable real-time alerts
              </label>
            </div>
          </FormSection>
        </Form>
      </Modal>

      {/* Configure Connection Modal */}
      <Modal 
        isOpen={showConfigureConnectionModal} 
        onClose={() => setShowConfigureConnectionModal(false)} 
        title="Configure Connection"
        size="lg"
      >
        <Form onSubmit={handleConfigureConnection} loading={isSubmitting}>
          <FormSection title="Connection Settings" description="Configure connection parameters">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Connection Name" htmlFor="connectionName" required error={formErrors.name}>
                <input
                  id="connectionName"
                  type="text"
                  value={connectionForm.name}
                  onChange={(e) => setConnectionForm({...connectionForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Production IoT Hub"
                />
              </FormField>
              
              <FormField label="Connection Type" htmlFor="connectionType" required>
                <select
                  id="connectionType"
                  value={connectionForm.type}
                  onChange={(e) => setConnectionForm({...connectionForm, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="iot-hub">IoT Hub</option>
                  <option value="event-hub">Event Hub</option>
                  <option value="sql-database">SQL Database</option>
                  <option value="cosmos-db">Cosmos DB</option>
                </select>
              </FormField>
            </div>
            
            <FormField label="Connection String" htmlFor="connectionString" required error={formErrors.connectionString}>
              <textarea
                id="connectionString"
                value={connectionForm.connectionString}
                onChange={(e) => setConnectionForm({...connectionForm, connectionString: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Enter connection string..."
              />
            </FormField>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Timeout (seconds)" htmlFor="timeout">
                <input
                  id="timeout"
                  type="number"
                  min="5"
                  max="300"
                  value={connectionForm.timeout}
                  onChange={(e) => setConnectionForm({...connectionForm, timeout: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormField>
              
              <FormField label="Retry Attempts" htmlFor="retryAttempts">
                <input
                  id="retryAttempts"
                  type="number"
                  min="1"
                  max="10"
                  value={connectionForm.retryAttempts}
                  onChange={(e) => setConnectionForm({...connectionForm, retryAttempts: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormField>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="enableSSL"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableSSL" className="text-sm font-medium text-gray-700">
                Enable SSL/TLS encryption
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="autoReconnect"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoReconnect" className="text-sm font-medium text-gray-700">
                Enable automatic reconnection
              </label>
            </div>
          </FormSection>
        </Form>
      </Modal>

      {/* Add User Modal */}
      <Modal 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)} 
        title="Add New User"
        size="lg"
      >
        <Form onSubmit={handleAddUser} loading={isSubmitting}>
          <FormSection title="User Information" description="Basic user details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="First Name" htmlFor="firstName" required error={formErrors.firstName}>
                <input
                  id="firstName"
                  type="text"
                  value={userForm.firstName}
                  onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter first name"
                />
              </FormField>
              
              <FormField label="Last Name" htmlFor="lastName" required error={formErrors.lastName}>
                <input
                  id="lastName"
                  type="text"
                  value={userForm.lastName}
                  onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter last name"
                />
              </FormField>
            </div>
            
            <FormField label="Email Address" htmlFor="email" required error={formErrors.email}>
              <input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </FormField>
            
            <FormField label="Department" htmlFor="department">
              <input
                id="department"
                type="text"
                value={userForm.department}
                onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Operations, Maintenance"
              />
            </FormField>
          </FormSection>
          
          <FormSection title="Access Permissions" description="User role and device access">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="User Role" htmlFor="role" required>
                <select
                  id="role"
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="operator">Operator</option>
                  <option value="technician">Technician</option>
                  <option value="administrator">Administrator</option>
                </select>
              </FormField>
              
              <FormField label="Device Access Level" htmlFor="deviceAccess" required>
                <select
                  id="deviceAccess"
                  value={userForm.deviceAccess}
                  onChange={(e) => setUserForm({...userForm, deviceAccess: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="read-only">Read Only</option>
                  <option value="read-write">Read & Write</option>
                  <option value="full-control">Full Control</option>
                </select>
              </FormField>
            </div>
            
            <FormField label="Device Access" htmlFor="deviceList">
              <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="allDevices"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allDevices" className="ml-2 text-sm font-medium text-gray-700">
                      All Devices
                    </label>
                  </div>
                  {deviceData.slice(0, 5).map(device => (
                    <div key={device.id} className="flex items-center">
                      <input
                        id={`device-${device.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`device-${device.id}`} className="ml-2 text-sm text-gray-700">
                        {device.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </FormField>
          </FormSection>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal 
        isOpen={showEditUserModal} 
        onClose={() => setShowEditUserModal(false)} 
        title={`Edit User: ${selectedUser?.user || ''}`}
        size="lg"
      >
        <Form onSubmit={handleEditUser} loading={isSubmitting}>
          <FormSection title="User Information" description="Update user details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="First Name" htmlFor="editFirstName" required error={formErrors.firstName}>
                <input
                  id="editFirstName"
                  type="text"
                  value={userForm.firstName}
                  onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormField>
              
              <FormField label="Last Name" htmlFor="editLastName" required error={formErrors.lastName}>
                <input
                  id="editLastName"
                  type="text"
                  value={userForm.lastName}
                  onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormField>
            </div>
            
            <FormField label="Email Address" htmlFor="editEmail" required error={formErrors.email}>
              <input
                id="editEmail"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>
            
            <FormField label="Department" htmlFor="editDepartment">
              <input
                id="editDepartment"
                type="text"
                value={userForm.department}
                onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>
          </FormSection>
          
          <FormSection title="Access Permissions" description="Update role and permissions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="User Role" htmlFor="editRole" required>
                <select
                  id="editRole"
                  value={userForm.role}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="operator">Operator</option>
                  <option value="technician">Technician</option>
                  <option value="administrator">Administrator</option>
                </select>
              </FormField>
              
              <FormField label="Device Access Level" htmlFor="editDeviceAccess" required>
                <select
                  id="editDeviceAccess"
                  value={userForm.deviceAccess}
                  onChange={(e) => setUserForm({...userForm, deviceAccess: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="read-only">Read Only</option>
                  <option value="read-write">Read & Write</option>
                  <option value="full-control">Full Control</option>
                </select>
              </FormField>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="editAccountActive"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="editAccountActive" className="text-sm font-medium text-gray-700">
                Account is active
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="editEmailNotifications"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="editEmailNotifications" className="text-sm font-medium text-gray-700">
                Send email notifications
              </label>
            </div>
          </FormSection>
        </Form>
      </Modal>
    </div>
  );
}