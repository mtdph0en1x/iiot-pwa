import { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import PaginatedDataTable from '../components/DataTable';
import { deviceData } from '../data/sampleData';
import { Download, Filter } from 'lucide-react';

export default function Logs() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Define columns for the data table
  const columns = [
    { header: 'Device Name', accessor: 'name' },
    { header: 'Workorder ID', accessor: 'workorderId' },
    { header: 'Uptime', accessor: 'uptime' },
    { header: 'Temperature', accessor: 'temperature' },
    { header: 'Production Rate', accessor: 'productionRate' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];
  
  // Handle filter changes
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Filter data based on selected filter
  const getFilteredData = () => {
    if (activeFilter === 'all') {
      return deviceData;
    }
    return deviceData.filter(device => device.status === activeFilter);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">System Logs</h3>
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition">
              <Download size={16} className="mr-1" />
              Export Logs
            </button>
            <div className="relative">
              <select 
                className="pl-3 pr-8 py-2 rounded-md border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={activeFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="all">All Logs</option>
                <option value="online">Online</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <PaginatedDataTable 
          columns={columns} 
          data={getFilteredData()}
          height="450px"
        />
      </div>
      
      {/* Additional filtering options or date range selector */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Log Filters</h3>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition"
          >
            <Filter size={16} className="mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                <select className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                  <option>All Devices</option>
                  {deviceData.slice(0, 5).map(device => (
                    <option key={device.id} value={device.id}>{device.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                  <option>All Events</option>
                  <option>Temperature</option>
                  <option>Production</option>
                  <option>Errors</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}