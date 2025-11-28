import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { deviceService } from '../services/deviceService';
import SecondaryNavbar from '../components/SecondaryNavbar';
import PaginatedDataTable from '../components/DataTable';
import { AlertCircle, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Errors() {
  const [activeTab, setActiveTab] = useState('suggestedActions');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Define columns for error data table
  const columns = [
    {
      header: 'Device ID',
      accessor: 'name',
      render: (row) => (
        <Link to={`/device/${row.name}`} className="text-blue-600 hover:text-blue-800 font-medium">
          {row.name}
        </Link>
      )
    },
    { header: 'Line ID', accessor: 'hubId' },
    {
      header: 'Error Type',
      accessor: 'errorType',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.errorType === 'EmergencyStop' || row.errorType === 'PowerFailure'
            ? 'bg-red-100 text-red-700'
            : row.errorType === 'LinePattern'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {row.errorType}
        </span>
      )
    },
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      render: (row) => new Date(row.timestamp).toLocaleString()
    },
    { header: 'Alert Code', accessor: 'alertCode' },
    {
      header: 'Suggested Action',
      accessor: 'suggestedAction',
      render: (row) => (
        <span className="text-sm text-gray-700">
          {row.suggestedAction}
        </span>
      )
    }
  ];
  
  // Define actions for each row in the error table
  const rowActions = (row) => (
    <div className="flex space-x-2">
      <Link
        to={`/device/${row.name}`}
        className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 transition"
      >
        View Device
      </Link>
      <button
        onClick={() => handleMarkResolved(row.id)}
        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
      >
        Resolve
      </button>
    </div>
  );

  // Load errors from API
  const loadErrors = async () => {
    try {
      setIsLoading(true);
      const data = await deviceService.getErrors({ daysBack: 7 });
      setErrors(data);
    } catch (error) {
      console.error('Failed to load errors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load errors on component mount
  useEffect(() => {
    loadErrors();
  }, []);

  // Refresh data from API
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadErrors();
    setIsRefreshing(false);
  };

  // Mark error as resolved
  const handleMarkResolved = (errorId) => {
    setErrors(prevErrors => prevErrors.filter(error => error.id !== errorId));
  };

  // Helper function to format relative time
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Calculate error history by day of week
  const calculateErrorHistory = () => {
    if (errors.length === 0) {
      return [
        { name: 'Mon', errors: 0 },
        { name: 'Tue', errors: 0 },
        { name: 'Wed', errors: 0 },
        { name: 'Thu', errors: 0 },
        { name: 'Fri', errors: 0 },
        { name: 'Sat', errors: 0 },
        { name: 'Sun', errors: 0 },
      ];
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const errorsByDay = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    errors.forEach(error => {
      const date = new Date(error.timestamp);
      const dayName = dayNames[date.getDay()];
      errorsByDay[dayName]++;
    });

    return [
      { name: 'Mon', errors: errorsByDay.Mon },
      { name: 'Tue', errors: errorsByDay.Tue },
      { name: 'Wed', errors: errorsByDay.Wed },
      { name: 'Thu', errors: errorsByDay.Thu },
      { name: 'Fri', errors: errorsByDay.Fri },
      { name: 'Sat', errors: errorsByDay.Sat },
      { name: 'Sun', errors: errorsByDay.Sun },
    ];
  };

  const errorHistoryData = calculateErrorHistory();

  // Calculate counts for action buttons
  const uniqueDevicesWithErrors = new Set(errors.map(e => e.name)).size;
  const totalAlerts = errors.length;

  return (
    <>
      <SecondaryNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Errors & Alerts</h2>
          <button 
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
          >
            <RefreshCw size={18} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Alerts
          </button>
        </div>
        
        {/* Content based on selected tab */}
        {activeTab === 'suggestedActions' && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Suggested Actions</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Loading alerts...</div>
              ) : errors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No active alerts</div>
              ) : (
                errors.slice(0, 10).map((error) => {
                  const isCritical = error.errorType === 'EmergencyStop' || error.errorType === 'PowerFailure';
                  const bgColor = isCritical ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500';
                  const IconComponent = isCritical ? AlertCircle : AlertTriangle;
                  const iconColor = isCritical ? 'text-red-500' : 'text-yellow-500';
                  const timeAgo = getTimeAgo(error.timestamp);

                  return (
                    <div key={error.id} className={`p-4 ${bgColor} border-l-4 rounded`}>
                      <div className="flex items-start">
                        <IconComponent className={`w-5 h-5 ${iconColor} mt-0.5 mr-2 flex-shrink-0`} />
                        <div className="flex-1">
                          <p className="font-medium">{error.suggestedAction}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Device: {error.name} | Error Code: {error.errorCode} | Type: {error.errorType}
                          </p>
                          <div className="mt-3 flex items-center space-x-2">
                            <Link
                              to={`/device/${error.name}`}
                              className={`px-3 py-1 text-sm ${
                                isCritical ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              } rounded transition`}
                            >
                              View Device
                            </Link>
                            <button
                              onClick={() => handleMarkResolved(error.id)}
                              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center"
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              Mark as Resolved
                            </button>
                          </div>
                        </div>
                        <span className="ml-2 px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600 whitespace-nowrap">
                          {timeAgo}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'deviceErrors' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium">Device Errors List</h3>
            </div>
            <PaginatedDataTable
              columns={columns}
              data={errors}
              actions={rowActions}
              height="350px"
              isLoading={isLoading || isRefreshing}
            />
          </div>
        )}
      
        {/* Error History Chart - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Error History</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={errorHistoryData}>
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
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">{uniqueDevicesWithErrors} {uniqueDevicesWithErrors === 1 ? 'device' : 'devices'}</span>
              </button>
              <button className="w-full flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md hover:bg-yellow-100 transition">
                <span className="font-medium">Acknowledge All Alerts</span>
                <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">{totalAlerts} {totalAlerts === 1 ? 'alert' : 'alerts'}</span>
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