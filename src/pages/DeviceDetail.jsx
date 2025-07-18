import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatusBadge from '../components/StatusBadge';
import { deviceData, temperatureData, productionData } from '../data/sampleData';
import { Settings, RefreshCw, AlertTriangle, Power } from 'lucide-react';
import SecondaryNavbar from '../components/SecondaryNavbar';
import Alert from '../components/Alert';

export default function UpdatedDeviceDetail() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [secondaryTab, setSecondaryTab] = useState('temperature');
  const [alert, setAlert] = useState(null);

  const handleRestart = () => {
    setAlert({
      type: 'warning',
      message: 'Device will restart.',
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleEmergencyStop = () => {
    setAlert({
      type: 'error',
      message: 'Emergency stop initiated!',
    });
    setTimeout(() => setAlert(null), 3000);
  };
 

  useEffect(() => {
    // Find the device by id
    const foundDevice = deviceData.find(d => d.id === parseInt(id));
    setDevice(foundDevice);
  }, [id]);

  if (!device) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Device not found</h2>
          <Link to="/live-data" className="text-blue-600 hover:text-blue-800">
            Back to Live Data
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SecondaryNavbar activeTab={secondaryTab} setActiveTab={setSecondaryTab} />
      
      <div className="space-y-6 p-6">
        {alert && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{device.name}</h2>
            <div className="flex items-center mt-1">
              <StatusBadge status={device.status} />
              <span className="ml-2 text-gray-500">ID: {device.workorderId}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </button>
            <button className="flex items-center px-3 py-2 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 transition">
              <Settings className="w-4 h-4 mr-1" />
              Configure
            </button>
            <button onClick={handleEmergencyStop} className="flex items-center px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition">
              <Power className="w-4 h-4 mr-1" />
              Emergency Stop
            </button>
          </div>
        </div>

        {/* Content based on selected tab in secondary navbar */}
        {secondaryTab === 'temperature' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Temperature Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Temperature Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Current Temperature</h4>
                  <p className="mt-1 text-2xl font-semibold">{device.temperature}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Warning Threshold</h4>
                  <p className="mt-1 text-2xl font-semibold text-yellow-600">80°C</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Critical Threshold</h4>
                  <p className="mt-1 text-2xl font-semibold text-red-600">90°C</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Temperature Control</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input 
                      type="range" 
                      min="20" 
                      max="100" 
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                      value={parseInt(device.temperature.replace('°C', ''))} 
                      readOnly
                    />
                  </div>
                  <div className="w-24">
                    <button className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                      Cool Down
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {secondaryTab === 'productionRate' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Production Rate Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Production Rate Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Current Rate</h4>
                  <p className="mt-1 text-2xl font-semibold">{device.productionRate}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Target Rate</h4>
                  <p className="mt-1 text-2xl font-semibold text-blue-600">65 units/hr</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Maximum Rate</h4>
                  <p className="mt-1 text-2xl font-semibold text-gray-600">80 units/hr</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Set Production Rate</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input 
                      type="range" 
                      min="0" 
                      max="80" 
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                      defaultValue={parseInt(device.productionRate.replace(' units/hr', ''))} 
                    />
                  </div>
                  <div className="w-24">
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      defaultValue={parseInt(device.productionRate.replace(' units/hr', ''))} 
                    />
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {secondaryTab === 'status' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Device Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="mb-2">
                        <StatusBadge status={device.status} />
                      </div>
                      <h4 className="text-xl font-semibold mt-2">Current Status</h4>
                      <p className="text-gray-500 mt-1">Last updated: 5 minutes ago</p>
                    </div>
                  </div>
                </div>
                <div>
                  <ul className="space-y-2">
                    <li className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Uptime</span>
                      <span>{device.uptime}</span>
                    </li>
                    <li className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Last Maintenance</span>
                      <span>2025-04-15</span>
                    </li>
                    <li className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Firmware Version</span>
                      <span>1.2.5</span>
                    </li>
                    <li className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Connection</span>
                      <span className="text-green-600">Connected</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Status Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={handleRestart} className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="w-6 h-6 text-blue-500 mb-2" />
                    <span className="font-medium">Restart Device</span>
                  </div>
                </button>
                <button className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition">
                  <div className="flex flex-col items-center">
                    <Settings className="w-6 h-6 text-yellow-500 mb-2" />
                    <span className="font-medium">Maintenance Mode</span>
                  </div>
                </button>
                <button onClick={handleEmergencyStop} className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition">
                  <div className="flex flex-col items-center">
                    <Power className="w-6 h-6 text-red-500 mb-2" />
                    <span className="font-medium">Emergency Stop</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Recent Status Changes</h3>
              <div className="overflow-y-auto max-h-60">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 text-xs text-gray-400">09:45</div>
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">Status changed to <span className="text-green-600">Online</span></p>
                      <p className="text-sm text-gray-500">Connection restored after maintenance</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 text-xs text-gray-400">09:30</div>
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">Status changed to <span className="text-blue-600">Maintenance</span></p>
                      <p className="text-sm text-gray-500">Scheduled maintenance performed</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 text-xs text-gray-400">09:00</div>
                    <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">Status changed to <span className="text-yellow-600">Warning</span></p>
                      <p className="text-sm text-gray-500">Temperature approaching threshold</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}