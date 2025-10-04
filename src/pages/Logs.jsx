import { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import PaginatedDataTable from '../components/DataTable';
import { deviceService } from '../services/deviceService';
import { Download, Filter } from 'lucide-react';

const containerMap = {
  'Compressor': 'telemetry-compressor',
  'Press': 'telemetry-press',
  'Conveyor': 'telemetry-conveyor',
  'QualityStation': 'telemetry-qcs'
};

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    deviceType: 'QualityStation',
    deviceId: '',
    date: new Date().toISOString().split('T')[0],
    errorOnly: false
  });

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    if (filters.date) {
      loadLogs();
    }
  }, [filters.deviceType, filters.deviceId, filters.date]);

  const loadDevices = async () => {
    try {
      const data = await deviceService.getDevices();
      setDevices(data);
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  };

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const container = containerMap[filters.deviceType];
      const params = {
        container,
        date: filters.date
      };
      if (filters.deviceId) {
        params.deviceId = filters.deviceId;
      }

      const data = await deviceService.getLogs(params);
      setLogs(data);
    } catch (error) {
      console.error('Failed to load logs:', error);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Common columns for all device types
  const commonColumns = [
    {
      header: 'Time',
      accessor: 'WindowEnd',
      render: (row) => new Date(row.WindowEnd).toLocaleTimeString()
    },
    { header: 'Device', accessor: 'DeviceId' },
    {
      header: 'Temp',
      accessor: 'AvgTemperature',
      render: (row) => `${Math.round(row.AvgTemperature)}°C`
    },
    {
      header: 'Availability',
      accessor: 'AvailabilityPercentage',
      render: (row) => `${Math.round(row.AvailabilityPercentage * 100)}%`
    },
    {
      header: 'Error Code',
      accessor: 'CurrentErrorCode',
      render: (row) => row.CurrentErrorCode || '-'
    }
  ];

  // Device-specific columns
  const deviceSpecificColumns = {
    'Compressor': [
      { header: 'Air Pressure', accessor: 'AvgSystemAirPressure', render: (row) => `${Math.round(row.AvgSystemAirPressure)} PSI` }
    ],
    'Press': [
      { header: 'Pressure', accessor: 'AvgPressure', render: (row) => `${Math.round(row.AvgPressure)} PSI` },
      { header: 'Status', accessor: 'PressureStatus' }
    ],
    'QualityStation': [
      { header: 'Good', accessor: 'GoodCount', render: (row) => row.GoodCount?.toLocaleString() },
      { header: 'Bad', accessor: 'BadCount', render: (row) => row.BadCount?.toLocaleString() },
      { header: 'Quality %', accessor: 'QualityPercentage', render: (row) => `${Math.round(row.QualityPercentage)}%` }
    ],
    'Conveyor': [
      { header: 'Status', accessor: 'ConveyorStatus' }
    ]
  };

  const columns = [
    ...commonColumns,
    ...(deviceSpecificColumns[filters.deviceType] || [])
  ];

  const getFilteredData = () => {
    let data = [...logs];
    if (filters.errorOnly) {
      data = data.filter(log => log.CurrentErrorCode !== 0 || log.ErrorEvents > 0);
    }
    return data;
  };

  const filteredDevices = devices.filter(d => d.deviceType === filters.deviceType);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Device Logs</h3>
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
          isLoading={isLoading}
        />
      </div>

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
                <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                <select
                  id="deviceType"
                  name="deviceType"
                  value={filters.deviceType}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <option value="QualityStation">Quality Station</option>
                  <option value="Compressor">Compressor</option>
                  <option value="Press">Press</option>
                  <option value="Conveyor">Conveyor</option>
                </select>
              </div>
              <div>
                <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                <select
                  id="deviceId"
                  name="deviceId"
                  value={filters.deviceId}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <option value="">All Devices</option>
                  {filteredDevices.map(device => (
                    <option key={device.id} value={device.id}>{device.id}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="errorOnly"
                    checked={filters.errorOnly}
                    onChange={handleFilterChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Errors Only</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
