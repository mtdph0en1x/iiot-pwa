import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatusBadge from '../components/StatusBadge';
import { deviceService } from '../services/deviceService';
import { Settings, RefreshCw, AlertTriangle, Power } from 'lucide-react';
import SecondaryNavbar from '../components/SecondaryNavbar';
import Alert from '../components/Alert';

export default function UpdatedDeviceDetail() {
  const { id } = useParams();
  const [deviceData, setDeviceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [secondaryTab, setSecondaryTab] = useState('temperature');
  const [alert, setAlert] = useState(null);
  const [targetProductionRate, setTargetProductionRate] = useState(0);

  const loadDeviceData = async () => {
    try {
      setIsLoading(true);
      const data = await deviceService.getDeviceDetail(id);
      setDeviceData(data);
      setTargetProductionRate(Math.round(data.current.AvgProductionRate));
    } catch (error) {
      console.error('Failed to load device:', error);
      setAlert({
        type: 'error',
        message: 'Failed to load device data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProductionRate = async () => {
    try {
      await deviceService.updateDeviceTwin(id, 'productionRate', targetProductionRate);
      setAlert({
        type: 'success',
        message: `Production rate updated to ${targetProductionRate} u/hr`,
      });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error('Failed to update production rate:', error);
      setAlert({
        type: 'error',
        message: 'Failed to update device twin',
      });
      setTimeout(() => setAlert(null), 3000);
    }
  };

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
    loadDeviceData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!deviceData) {
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

  const device = deviceData.current;
  const historical = deviceData.historical;

  // Determine status
  const getStatus = () => {
    if (device.CurrentErrorCode !== 0) return 'error';
    if (device.AvailabilityPercentage < 0.8) return 'offline';
    if (device.AvgTemperature > 80) return 'warning';
    return 'online';
  };

  // Calculate time since last update
  const getLastUpdatedText = () => {
    if (!device.WindowEnd) return 'Unknown';

    const now = new Date();
    const lastUpdate = new Date(device.WindowEnd);
    const diffMs = now - lastUpdate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

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

        <div>
          <h2 className="text-2xl font-bold">{device.DeviceId}</h2>
          <div className="flex items-center mt-1">
            <StatusBadge status={getStatus()} />
            <span className="ml-2 text-gray-500">{device.DeviceType} • {device.LineName}</span>
          </div>
        </div>

        {/* Content based on selected tab in secondary navbar */}
        {secondaryTab === 'temperature' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Temperature Trend (24h)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historical}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="temperature" stroke="#EF4444" strokeWidth={2} name="Temperature °C" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Current Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Temperature</h4>
                  <p className="mt-1 text-2xl font-semibold">{Math.round(device.AvgTemperature)}°C</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Production Rate</h4>
                  <p className="mt-1 text-2xl font-semibold">{Math.round(device.AvgProductionRate)} u/hr</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Availability</h4>
                  <p className="mt-1 text-2xl font-semibold">{Math.round(device.AvailabilityPercentage * 100)}%</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Error Code</h4>
                  <p className="mt-1 text-2xl font-semibold">{device.CurrentErrorCode || 'None'}</p>
                </div>
              </div>

              {/* Device-specific metrics */}
              {device.DeviceType === 'Compressor' && device.AvgSystemAirPressure && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">System Air Pressure</h4>
                    <p className="mt-1 text-xl font-semibold">{Math.round(device.AvgSystemAirPressure)} PSI</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Output Air Pressure</h4>
                    <p className="mt-1 text-xl font-semibold">{Math.round(device.AvgOutputAirPressure)} PSI</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Efficiency</h4>
                    <p className="mt-1 text-xl font-semibold">{device.Efficiency ? `${Math.round(device.Efficiency)}%` : 'N/A'}</p>
                  </div>
                </div>
              )}

              {device.DeviceType === 'Press' && device.AvgPressure && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Avg Pressure</h4>
                    <p className="mt-1 text-xl font-semibold">{Math.round(device.AvgPressure)} PSI</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Pressure Range</h4>
                    <p className="mt-1 text-xl font-semibold">{Math.round(device.MinPressure)} - {Math.round(device.MaxPressure)}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="mt-1 text-xl font-semibold">{device.PressureStatus}</p>
                  </div>
                </div>
              )}

              {device.DeviceType === 'QualityStation' && device.GoodCount !== undefined && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Good Count</h4>
                    <p className="mt-1 text-xl font-semibold">{device.GoodCount.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Bad Count</h4>
                    <p className="mt-1 text-xl font-semibold">{device.BadCount.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Quality %</h4>
                    <p className="mt-1 text-xl font-semibold">{Math.round(device.QualityPercentage)}%</p>
                  </div>
                </div>
              )}

              {device.DeviceType === 'Conveyor' && device.ConveyorStatus && (
                <div className="mt-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500">Conveyor Status</h4>
                    <p className="mt-1 text-xl font-semibold">{device.ConveyorStatus}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {secondaryTab === 'productionRate' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Production Rate Trend (24h)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historical}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="productionRate" stroke="#3B82F6" strokeWidth={2} name="Production Rate (u/hr)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Production Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Current Rate</h4>
                  <p className="mt-1 text-2xl font-semibold">{Math.round(device.AvgProductionRate)} u/hr</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Availability</h4>
                  <p className="mt-1 text-2xl font-semibold text-blue-600">{Math.round(device.AvailabilityPercentage * 100)}%</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Error Events</h4>
                  <p className="mt-1 text-2xl font-semibold text-gray-600">{device.ErrorEvents || 0}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2">Set Target Production Rate</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={targetProductionRate}
                      onChange={(e) => setTargetProductionRate(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={targetProductionRate}
                      onChange={(e) => setTargetProductionRate(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleUpdateProductionRate}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
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
                        <StatusBadge status={getStatus()} />
                      </div>
                      <h4 className="text-xl font-semibold mt-2">Current Status</h4>
                      <p className="text-gray-500 mt-1">Last updated: {getLastUpdatedText()}</p>
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
          </div>
        )}
      </div>
    </>
  );
}