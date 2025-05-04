import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { errorData } from '../data/sampleData';

export default function Errors() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Errors & Alerts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IoT Hub ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suggested Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {errorData.map(error => (
                <tr key={error.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{error.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.hubId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.uptime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.temperature}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.alertCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.suggestedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Suggested Actions</h3>
          <ul className="space-y-3">
            <li className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="font-medium">Check cooling system on Device E</p>
              <p className="text-sm text-gray-600 mt-1">Temperature has exceeded normal operating range (95°C)</p>
            </li>
            <li className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <p className="font-medium">Monitor temperature levels on Device C</p>
              <p className="text-sm text-gray-600 mt-1">Temperature approaching critical threshold (85°C)</p>
            </li>
          </ul>
        </div>
        
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
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Error Resolution Actions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {errorData.map(error => (
                <tr key={error.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{error.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{error.alertCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="mr-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition">Reset</button>
                    <button className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 transition">Acknowledge</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}