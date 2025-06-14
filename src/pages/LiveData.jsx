import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatusBadge from '../components/StatusBadge';
import PaginatedDataTable from '../components/DataTable';
import { temperatureData, deviceData } from '../data/sampleData';
import { RefreshCw, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LiveData() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Simulate data refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };
  
  // Define columns for the data table
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
    { header: 'Workorder ID', accessor: 'workorderId' },
    { header: 'Uptime', accessor: 'uptime' },
    { header: 'Temperature', accessor: 'temperature' },
    { header: 'Production Rate', accessor: 'productionRate' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
  ];
  
  // Define actions for each row
  const rowActions = (row) => (
    <div className="flex space-x-2">
      <Link 
        to={`/device/${row.id}`}
        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
      >
        View
      </Link>
      <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition">
        Reset
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Real-Time Device Data</h3>
          <div className="flex space-x-2">
            <button 
              onClick={handleRefresh}
              className="flex items-center px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={() => setShowFilterModal(true)}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition"
            >
              <Filter size={16} className="mr-1" />
              Filter
            </button>
          </div>
        </div>
        
        <PaginatedDataTable 
          columns={columns} 
          data={deviceData} 
          actions={rowActions}
          height="400px"
          isLoading={isRefreshing}
        />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Live Temperature Readings</h3>
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
      
      {/* We could add a filter modal here later */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-medium mb-4">Filter Options</h3>
            {/* Filter form would go here */}
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}