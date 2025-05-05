import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { deviceData, kpiData } from '../data/sampleData';

// Enhanced data for the KPI detail view
const devicePerformance = deviceData.map(device => ({
  name: device.name,
  availability: Math.floor(Math.random() * 30) + 70, // Random value between 70-100
  quality: Math.floor(Math.random() * 20) + 80, // Random value between 80-100
  performance: Math.floor(Math.random() * 25) + 70, // Random value between 70-95
  oee: 0, // Will calculate
  productionRate: parseInt(device.productionRate.replace(' units/hr', '')),
})).map(device => {
  // Calculate OEE (Overall Equipment Effectiveness)
  const oee = Math.round((device.availability * device.quality * device.performance) / 10000);
  return { ...device, oee };
});

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function KPIDetail() {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('oee');

  // Data for the first chart based on the selected metric
  const getMetricData = () => {
    switch (selectedMetric) {
      case 'oee':
        return devicePerformance.map(device => ({
          name: device.name,
          value: device.oee
        }));
      case 'availability':
        return devicePerformance.map(device => ({
          name: device.name,
          value: device.availability
        }));
      case 'quality':
        return devicePerformance.map(device => ({
          name: device.name,
          value: device.quality
        }));
      case 'performance':
        return devicePerformance.map(device => ({
          name: device.name,
          value: device.performance
        }));
      case 'production':
        return devicePerformance.map(device => ({
          name: device.name,
          value: device.productionRate
        }));
      default:
        return devicePerformance.map(device => ({
          name: device.name,
          value: device.oee
        }));
    }
  };

  // Format data for the OEE components pie chart
  const oeeComponentsData = [
    { name: 'Availability', value: kpiData.overall.availability },
    { name: 'Quality', value: kpiData.overall.quality },
    { name: 'Performance', value: kpiData.overall.performance },
  ];

  // Format data for the OEE trend chart
  const oeeTrendData = kpiData.monthly.map(month => ({
    name: month.month,
    oee: month.oee,
    availability: month.availability,
    quality: month.quality,
    performance: month.performance,
  }));

  // Calculate the average performance metrics
  const averageOEE = devicePerformance.reduce((sum, device) => sum + device.oee, 0) / devicePerformance.length;
  const averageAvailability = devicePerformance.reduce((sum, device) => sum + device.availability, 0) / devicePerformance.length;
  const averageQuality = devicePerformance.reduce((sum, device) => sum + device.quality, 0) / devicePerformance.length;
  const averagePerformance = devicePerformance.reduce((sum, device) => sum + device.performance, 0) / devicePerformance.length;

  // Generate comparison data for top performers vs average
  const comparisonData = [
    {
      name: 'OEE',
      topPerformer: Math.max(...devicePerformance.map(device => device.oee)),
      average: averageOEE,
    },
    {
      name: 'Availability',
      topPerformer: Math.max(...devicePerformance.map(device => device.availability)),
      average: averageAvailability,
    },
    {
      name: 'Quality',
      topPerformer: Math.max(...devicePerformance.map(device => device.quality)),
      average: averageQuality,
    },
    {
      name: 'Performance',
      topPerformer: Math.max(...devicePerformance.map(device => device.performance)),
      average: averagePerformance,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">KPI Detail Analysis</h2>
        <div className="flex items-center space-x-4">
          <select 
            className="pl-3 pr-8 py-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition">
            Export Data
          </button>
        </div>
      </div>
      
      {/* Metric Selection Tabs */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Performance Analysis</h3>
          <div className="flex bg-gray-100 rounded-md p-1">
            <button 
              onClick={() => setSelectedMetric('oee')} 
              className={`px-3 py-1 rounded-md ${selectedMetric === 'oee' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              OEE
            </button>
            <button 
              onClick={() => setSelectedMetric('availability')} 
              className={`px-3 py-1 rounded-md ${selectedMetric === 'availability' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Availability
            </button>
            <button 
              onClick={() => setSelectedMetric('quality')} 
              className={`px-3 py-1 rounded-md ${selectedMetric === 'quality' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Quality
            </button>
            <button 
              onClick={() => setSelectedMetric('performance')} 
              className={`px-3 py-1 rounded-md ${selectedMetric === 'performance' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Performance
            </button>
            <button 
              onClick={() => setSelectedMetric('production')} 
              className={`px-3 py-1 rounded-md ${selectedMetric === 'production' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              Production
            </button>
          </div>
        </div>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getMetricData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* OEE Components and Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">OEE Components Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={oeeComponentsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {oeeComponentsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">OEE Trend Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oeeTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="oee" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Performance Comparison */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Top Performers vs Average</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="topPerformer" name="Top Performer" fill="#10B981" />
              <Bar dataKey="average" name="Average" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Detailed Metrics Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Detailed KPI Metrics</h3>
          <input
            type="text"
            placeholder="Search devices..."
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OEE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {devicePerformance.map((device, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{device.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.oee}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.availability}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.quality}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.performance}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.productionRate} units/hr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}