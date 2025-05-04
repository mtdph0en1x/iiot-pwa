import { BarChart2, Thermometer, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import { productionData, temperatureData, errorData } from '../data/sampleData';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Production Rate" 
          value="62 units/hr" 
          change="+5.2%" 
          icon={<BarChart2 className="w-8 h-8 text-blue-500" />} 
        />
        <DashboardCard 
          title="Temperature" 
          value="75°C" 
          change="+2.1°C" 
          icon={<Thermometer className="w-8 h-8 text-red-500" />} 
        />
        <DashboardCard 
          title="Active Alerts" 
          value="2" 
          change="-1" 
          icon={<AlertCircle className="w-8 h-8 text-yellow-500" />} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>

      {/* Recent Alerts Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Recent Alerts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {errorData.map(error => (
                <tr key={error.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{error.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.alertCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.temperature}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.suggestedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}