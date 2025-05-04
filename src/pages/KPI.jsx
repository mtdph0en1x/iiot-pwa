import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { kpiData } from '../data/sampleData';
import DashboardCard from '../components/DashboardCard';
import { Activity, Check, Clock, TrendingUp } from 'lucide-react';

export default function KPI() {
  const { overall, monthly } = kpiData;
  
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold mb-6">Key Performance Indicators</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="OEE" 
          value={`${overall.oee}%`} 
          change="+3%" 
          icon={<TrendingUp className="w-8 h-8 text-blue-500" />} 
        />
        <DashboardCard 
          title="Availability" 
          value={`${overall.availability}%`} 
          change="+2%" 
          icon={<Clock className="w-8 h-8 text-green-500" />} 
        />
        <DashboardCard 
          title="Performance" 
          value={`${overall.performance}%`} 
          change="+1%" 
          icon={<Activity className="w-8 h-8 text-yellow-500" />} 
        />
        <DashboardCard 
          title="Quality" 
          value={`${overall.quality}%`} 
          change="+1.5%" 
          icon={<Check className="w-8 h-8 text-purple-500" />} 
        />
      </div>
      
      {/* OEE Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">OEE Trend (6 Months)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="oee" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Component KPIs */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">OEE Components</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="availability" fill="#10B981" />
              <Bar dataKey="performance" fill="#F59E0B" />
              <Bar dataKey="quality" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* KPI Details Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">KPI Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OEE</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthly.map((month, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month.month}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.availability}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.performance}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.quality}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.oee}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}