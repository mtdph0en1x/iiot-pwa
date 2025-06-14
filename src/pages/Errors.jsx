import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { errorData } from '../data/sampleData';
import SecondaryNavbar from '../components/SecondaryNavbar';
import PaginatedDataTable from '../components/DataTable';
import { AlertCircle, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Errors() {
  const [activeTab, setActiveTab] = useState('suggestedActions');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Define columns for error data table
  const columns = [
    { 
      header: 'Device Name', 
      accessor: 'name',
      render: (row) => (
        <Link to={`/device/${row.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
          {row.name}
        </Link>
      )
    },
    { header: 'IoT Hub ID', accessor: 'hubId' },
    { header: 'Uptime', accessor: 'uptime' },
    { header: 'Temperature', accessor: 'temperature' },
    { header: 'Alert Code', accessor: 'alertCode' },
    { 
      header: 'Suggested Action', 
      accessor: 'suggestedAction',
      render: (row) => (
        <span className="px-3 py-1 inline-flex items-center bg-red-100 text-red-600 rounded-full">
          {row.suggestedAction}
        </span>
      )
    }
  ];
  
  // Define actions for each row in the error table
  const rowActions = (row) => (
    <div className="flex space-x-2">
      <Link 
        to={`/device/${row.id}`}
        className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 transition"
      >
        View Device
      </Link>
      <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition">
        Resolve
      </button>
    </div>
  );

  // Simulate data refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

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
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">Check cooling system on Device E</p>
                    <p className="text-sm text-gray-600 mt-1">Temperature has exceeded normal operating range (95°C)</p>
                    <div className="mt-3 flex items-center space-x-2">
                      <Link 
                        to="/device/5"
                        className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                      >
                        View Device
                      </Link>
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">5 min ago</span>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">Monitor temperature levels on Device C</p>
                    <p className="text-sm text-gray-600 mt-1">Temperature approaching critical threshold (85°C)</p>
                    <div className="mt-3 flex items-center space-x-2">
                      <Link 
                        to="/device/3"
                        className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                      >
                        View Device
                      </Link>
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">12 min ago</span>
                </div>
              </div>
              
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">Emergency maintenance required for Device E</p>
                    <p className="text-sm text-gray-600 mt-1">Production stopped due to critical temperature (95°C)</p>
                    <div className="mt-3 flex items-center space-x-2">
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                        Emergency Stop
                      </button>
                      <Link 
                        to="/device/5"
                        className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                      >
                        View Device
                      </Link>
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">1 min ago</span>
                </div>
              </div>
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
              data={errorData} 
              actions={rowActions}
              height="350px"
              isLoading={isRefreshing}
            />
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