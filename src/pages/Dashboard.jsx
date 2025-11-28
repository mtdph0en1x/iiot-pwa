import React, { useState, useEffect } from 'react';
import { BarChart2, Thermometer, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import { deviceService } from '../services/deviceService';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Fetch devices, KPI data, and telemetry logs in parallel
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);

      const [devicesData, kpiHistoryData] = await Promise.all([
        deviceService.getDevices(),
        deviceService.getLineKPIs(null, 7) // Last 7 days
      ]);

      setDevices(devicesData);
      setKpiData(kpiHistoryData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate current metrics from devices
  const calculateCurrentMetrics = () => {
    if (devices.length === 0) {
      return {
        avgProductionRate: 0,
        avgTemperature: 0,
        activeAlerts: 0
      };
    }

    const totalProduction = devices.reduce((sum, device) => {
      const rate = parseInt(device.productionRate) || 0;
      return sum + rate;
    }, 0);

    const totalTemp = devices.reduce((sum, device) => {
      const temp = parseInt(device.temperature) || 0;
      return sum + temp;
    }, 0);

    const alertCount = devices.filter(d => d.status === 'error' || d.status === 'warning').length;

    return {
      avgProductionRate: Math.round(totalProduction / devices.length),
      avgTemperature: Math.round(totalTemp / devices.length),
      activeAlerts: alertCount
    };
  };

  // Prepare production rate trend data from KPI history
  const prepareProductionData = () => {
    if (kpiData.length === 0) return [];

    return kpiData.slice(0, 12).reverse().map(item => {
      const date = new Date(item.WindowEnd);
      return {
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        value: Math.round(item.LinePerformanceRate || 0)
      };
    });
  };

  // Prepare quality trend data from KPI history
  const prepareQualityData = () => {
    if (kpiData.length === 0) return [];

    return kpiData.slice(0, 12).reverse().map(item => {
      const date = new Date(item.WindowEnd);
      return {
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        value: Math.round(item.LineQualityPercentage || 0)
      };
    });
  };

  // Get devices with alerts
  const getDevicesWithAlerts = () => {
    return devices
      .filter(d => d.status === 'error' || d.status === 'warning')
      .slice(0, 5)
      .map(device => ({
        id: device.id,
        name: device.name,
        alertCode: device.errorCode || 'N/A',
        temperature: device.temperature,
        status: device.status,
        suggestedAction: device.status === 'error'
          ? 'Check device immediately'
          : 'Monitor temperature'
      }));
  };

  const currentMetrics = calculateCurrentMetrics();
  const productionData = prepareProductionData();
  const qualityData = prepareQualityData();
  const alertDevices = getDevicesWithAlerts();

  // Calculate changes (comparing latest to previous)
  const calculateChange = (data) => {
    if (data.length < 2) return '+0%';
    const latest = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    const change = ((latest - previous) / previous * 100).toFixed(1);
    return change >= 0 ? `+${change}%` : `${change}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Avg Production Rate"
          value={`${currentMetrics.avgProductionRate} units/hr`}
          change={productionData.length > 0 ? calculateChange(productionData) : '+0%'}
          icon={<BarChart2 className="w-8 h-8 text-blue-500" />}
        />
        <DashboardCard
          title="Avg Temperature"
          value={`${currentMetrics.avgTemperature}°C`}
          change={qualityData.length > 0 ? calculateChange(qualityData) : '+0%'}
          icon={<Thermometer className="w-8 h-8 text-red-500" />}
        />
        <DashboardCard
          title="Active Alerts"
          value={currentMetrics.activeAlerts.toString()}
          change={currentMetrics.activeAlerts > 0 ? 'Attention needed' : 'All systems normal'}
          icon={<AlertCircle className="w-8 h-8 text-yellow-500" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Production Rate Trend (Last 7 Days)</h3>
          <div className="h-64">
            {productionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Quality Trend (Last 7 Days)</h3>
          <div className="h-64">
            {qualityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={qualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} name="Quality %" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Alerts Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Recent Alerts</h3>
        <div className="overflow-x-auto">
          {alertDevices.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alertDevices.map(alert => (
                  <tr key={alert.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={alert.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.alertCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.temperature}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.suggestedAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No active alerts - all systems operating normally
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
