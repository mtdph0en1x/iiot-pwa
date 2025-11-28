import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatusBadge from '../components/StatusBadge';
import PaginatedDataTable from '../components/DataTable';
import { deviceService } from '../services/deviceService';
import { RefreshCw, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LiveData() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [devices, setDevices] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Load data and set up auto-refresh
  useEffect(() => {
    loadDevices();

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      loadDevices();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Apply filters when devices or filters change
  useEffect(() => {
    applyFilters(filters);
  }, [devices, filters]);

  // Load devices from API
  const loadDevices = async () => {
    try {
      const data = await deviceService.getDevices();
      setDevices(data);
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (currentFilters) => {
    let data = [...devices];

    // Filter by search term
    if (currentFilters.search) {
      data = data.filter(device =>
        device.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        device.id.toLowerCase().includes(currentFilters.search.toLowerCase())
      );
    }

    // Filter by status
    if (currentFilters.status !== 'all') {
      data = data.filter(device => device.status === currentFilters.status);
    }

    setFilteredData(data);
  };

  // Manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDevices();
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  // Define columns for the data table
  const columns = [
    {
      header: 'Device ID',
      accessor: 'id',
      render: (row) => (
        <Link to={`/device/${row.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
          {row.id}
        </Link>
      )
    },
    { header: 'Device Type', accessor: 'deviceType' },
    { header: 'Line', accessor: 'lineName' },
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
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition"
            >
              <Filter size={16} className="mr-1" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
        
        <PaginatedDataTable 
          columns={columns} 
          data={filteredData} 
          actions={rowActions}
          height="400px"
          isLoading={isRefreshing}
        />
      </div>
      
      
      {showFilters && (
        <div className="bg-white rounded-lg shadow">
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
                  placeholder="Search by name or ID..."
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
                  <option value="all">All</option>
                  <option value="online">Online</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}