import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { kpiData } from '../data/sampleData';
import DashboardCard from '../components/DashboardCard';
import { Activity, Check, Clock, TrendingUp } from 'lucide-react';
import SecondaryNavbar from '../components/SecondaryNavbar';

export default function KPI() {
  const { overall, monthly } = kpiData;
  const [activeTab, setActiveTab] = useState('goodProduction');
  
  return (
    <>
      <SecondaryNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-6">Key Performance Indicators</h2>
          <Link to="/kpi/detail" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
            View Detailed Analysis
          </Link>
        </div>
        
        {/* KPI Cards - Always visible */}
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
        
        {/* Content based on selected tab */}
        {activeTab === 'goodProduction' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Overall Good Production</h3>
            <div className="h-96 bg-blue-50 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="quality" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {activeTab === 'productionRate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Production Rate Trend</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthly.map(item => ({
                    month: item.month,
                    value: item.performance
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Production Rate" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Production Rate by Device</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Device A', value: 60 },
                      { name: 'Device B', value: 55 },
                      { name: 'Device C', value: 45 },
                      { name: 'Device D', value: 62 },
                      { name: 'Device E', value: 0 },
                      { name: 'Device F', value: 0 },
                      { name: 'Device G', value: 0 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Units/hr" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'failureFrequency' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Failure Frequency Analysis</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Device A', count: 1 },
                    { name: 'Device B', count: 0 },
                    { name: 'Device C', count: 3 },
                    { name: 'Device D', count: 2 },
                    { name: 'Device E', count: 8 },
                    { name: 'Device F', count: 1 },
                    { name: 'Device G', count: 0 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Failures" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Most Common Failures</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Temperature exceeding threshold</span>
                  <span className="font-semibold">42%</span>
                </li>
                <li className="flex justify-between">
                  <span>Communication errors</span>
                  <span className="font-semibold">27%</span>
                </li>
                <li className="flex justify-between">
                  <span>Power fluctuations</span>
                  <span className="font-semibold">18%</span>
                </li>
                <li className="flex justify-between">
                  <span>Mechanical failures</span>
                  <span className="font-semibold">13%</span>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* KPI Details Table - Always visible */}
        <div className="bg-white p-4 rounded-lg shadow">
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
    </>
  );
}