import { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import PaginatedDataTable from '../components/DataTable';
import { deviceData } from '../data/sampleData';
import { Download, Filter } from 'lucide-react';

export default function Logs() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ 
    search: '', 
    status: 'all', 
    startDate: '', 
    endDate: '', 
    device: 'all', 
    eventType: 'all' 
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "activeFilter") {
      setActiveFilter(value);
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };
  
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
  
  

  // Filter data based on selected filter
  const getFilteredData = () => {
    let data = [...deviceData];

    // Filter by search term
    if (filters.search) {
      data = data.filter(device => 
        device.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        device.workorderId.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      data = data.filter(device => device.status === filters.status);
    }

    // Note: Date, device, and event type filters are not implemented as there is no date or event type data in the sample data.

    return data;
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
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Search logs..."
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <option value="all">All Logs</option>
                  <option value="online">Online</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
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