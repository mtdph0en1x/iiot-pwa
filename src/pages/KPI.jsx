import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { kpiData } from '../data/sampleData';
import DashboardCard from '../components/DashboardCard';
import PaginatedDataTable from '../components/DataTable';
import { Activity, Check, Clock, TrendingUp, Download } from 'lucide-react';
import SecondaryNavbar from '../components/SecondaryNavbar';

export default function KPI() {
  const { overall, monthly } = kpiData;
  const [activeTab, setActiveTab] = useState('goodProduction');
  
  // Define columns for the KPI data table
  const columns = [
    { header: 'Month', accessor: 'month' },
    { 
      header: 'Availability', 
      accessor: 'availability',
      render: (row) => `${row.availability}%`
    },
    { 
      header: 'Performance', 
      accessor: 'performance',
      render: (row) => `${row.performance}%`
    },
    { 
      header: 'Quality', 
      accessor: 'quality',
      render: (row) => `${row.quality}%`
    },
    { 
      header: 'OEE', 
      accessor: 'oee',
      render: (row) => `${row.oee}%`
    }
  ];
  
  return (
    <>
      <SecondaryNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Key Performance Indicators</h2>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition">
              <Download size={18} className="mr-2" />
              Export Data
            </button>
            <Link to="/kpi/detail" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              View Detailed Analysis
            </Link>
          </div>
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
            <div className="h-96 rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="quality" name="Quality" stroke="#8884d8" strokeWidth={2} />
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
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium">KPI Details</h3>
            <div>
              <select className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="6month">Last 6 Months</option>
                <option value="year">Last Year</option>
                <option value="2year">Last 2 Years</option>
              </select>
            </div>
          </div>
          
          <PaginatedDataTable 
            columns={columns} 
            data={monthly} 
            height="300px"
          />
        </div>
      </div>
    </>
  );
}