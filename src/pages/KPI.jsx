import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { deviceService } from '../services/deviceService';
import DashboardCard from '../components/DashboardCard';
import PaginatedDataTable from '../components/DataTable';
import { Activity, Check, Clock, TrendingUp, Download } from 'lucide-react';
import SecondaryNavbar from '../components/SecondaryNavbar';

export default function KPI() {
  const [activeTab, setActiveTab] = useState('goodProduction');
  const [kpiData, setKpiData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [daysBack, setDaysBack] = useState(30);

  useEffect(() => {
    loadKPIs();
    loadErrors();
  }, [daysBack]);

  const loadKPIs = async () => {
    try {
      setIsLoading(true);
      const data = await deviceService.getLineKPIs(null, daysBack);
      setKpiData(data);
    } catch (error) {
      console.error('Failed to load KPIs:', error);
      setKpiData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadErrors = async () => {
    try {
      const data = await deviceService.getErrors({ daysBack });
      setErrorData(data);
    } catch (error) {
      console.error('Failed to load errors:', error);
      setErrorData([]);
    }
  };

  // Calculate overall metrics from KPI data
  const calculateOverall = () => {
    if (kpiData.length === 0) return { oee: 0, availability: 0, performance: 0, quality: 0 };

    const latest = kpiData[0];
    const availability = latest.LineAvailability;
    const quality = latest.LineQualityPercentage;
    const performance = 100;
    const oee = (availability * performance * quality) / 10000;

    return {
      oee: Math.round(oee),
      availability: Math.round(availability),
      performance: Math.round(performance),
      quality: Math.round(quality)
    };
  };

  const overall = calculateOverall();

  // Calculate changes (comparing latest to previous period)
  const calculateChanges = () => {
    if (kpiData.length < 2) {
      return {
        oee: '+0%',
        availability: '+0%',
        performance: '+0%',
        quality: '+0%'
      };
    }

    const latest = kpiData[0];
    const previous = kpiData[1];

    const calcChange = (latestVal, prevVal) => {
      if (prevVal === 0) return '+0%';
      const change = ((latestVal - prevVal) / prevVal * 100).toFixed(1);
      return change >= 0 ? `+${change}%` : `${change}%`;
    };

    const latestOee = (latest.LineAvailability * 100 * latest.LineQualityPercentage) / 10000;
    const prevOee = (previous.LineAvailability * 100 * previous.LineQualityPercentage) / 10000;

    return {
      oee: calcChange(latestOee, prevOee),
      availability: calcChange(latest.LineAvailability, previous.LineAvailability),
      performance: '+0%', // Placeholder since performance is always 100
      quality: calcChange(latest.LineQualityPercentage, previous.LineQualityPercentage)
    };
  };

  const changes = calculateChanges();

  // Group KPI data by day for charts
  const dailyData = kpiData.map(item => {
    const date = new Date(item.WindowEnd);
    return {
      date: date.toLocaleDateString(),
      timestamp: item.WindowEnd,
      availability: Math.round(item.LineAvailability),
      quality: Math.round(item.LineQualityPercentage),
      performance: 100, // Placeholder
      oee: Math.round((item.LineAvailability * item.LineQualityPercentage * 100) / 10000),
      goodCount: item.TotalGoodCount,
      badCount: item.TotalBadCount,
      productionRate: Math.round(item.LinePerformanceRate)
    };
  }).reverse();

  // Calculate error frequency data from error events
  const calculateErrorFrequency = () => {
    if (errorData.length === 0) return [];

    // Group errors by date
    const errorsByDate = {};
    errorData.forEach(error => {
      const date = new Date(error.timestamp).toLocaleDateString();
      errorsByDate[date] = (errorsByDate[date] || 0) + 1;
    });

    // Create array matching dailyData dates
    return dailyData.map(item => ({
      ...item,
      errorCount: errorsByDate[item.date] || 0
    }));
  };

  const errorFrequencyData = calculateErrorFrequency();

  // Define columns for the KPI data table
  const columns = [
    {
      header: 'Date',
      accessor: 'date'
    },
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
        <div>
          <h2 className="text-2xl font-bold">Key Performance Indicators</h2>
        </div>
        
        {/* KPI Cards - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="OEE"
            value={`${overall.oee}%`}
            change={changes.oee}
            icon={<TrendingUp className="w-8 h-8 text-blue-500" />}
          />
          <DashboardCard
            title="Availability"
            value={`${overall.availability}%`}
            change={changes.availability}
            icon={<Clock className="w-8 h-8 text-green-500" />}
          />
          <DashboardCard
            title="Performance"
            value={`${overall.performance}%`}
            change={changes.performance}
            icon={<Activity className="w-8 h-8 text-yellow-500" />}
          />
          <DashboardCard
            title="Quality"
            value={`${overall.quality}%`}
            change={changes.quality}
            icon={<Check className="w-8 h-8 text-purple-500" />}
          />
        </div>
        
        {/* Content based on selected tab */}
        {activeTab === 'goodProduction' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Overall Good Production</h3>
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : (
              <div className="h-96 rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="quality" name="Quality %" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'productionRate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Availability Trend</h3>
              {isLoading ? (
                <div className="h-72 flex items-center justify-center">
                  <div className="text-gray-500">Loading...</div>
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="availability" name="Availability %" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Good vs Bad Production</h3>
              {isLoading ? (
                <div className="h-72 flex items-center justify-center">
                  <div className="text-gray-500">Loading...</div>
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="goodCount" name="Good Count" fill="#10B981" />
                      <Bar dataKey="badCount" name="Bad Count" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'failureFrequency' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Error Frequency Analysis</h3>
            {isLoading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : (
              <>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={errorFrequencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="errorCount" name="Errors" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Error Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Errors (Period):</span>
                      <span className="font-semibold">{errorData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Errors per Day:</span>
                      <span className="font-semibold">
                        {errorFrequencyData.length > 0
                          ? Math.round(errorData.length / errorFrequencyData.length)
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* KPI Details Table - Always visible */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium">KPI Details</h3>
            <div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={daysBack}
                onChange={(e) => setDaysBack(parseInt(e.target.value))}
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="180">Last 6 Months</option>
              </select>
            </div>
          </div>

          <PaginatedDataTable
            columns={columns}
            data={dailyData}
            height="300px"
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}