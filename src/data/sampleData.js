// Production data for charts
export const productionData = [
    { name: '00:00', value: 40 },
    { name: '02:00', value: 35 },
    { name: '04:00', value: 45 },
    { name: '06:00', value: 50 },
    { name: '08:00', value: 65 },
    { name: '10:00', value: 75 },
    { name: '12:00', value: 70 },
    { name: '14:00', value: 60 },
    { name: '16:00', value: 65 },
    { name: '18:00', value: 55 },
    { name: '20:00', value: 50 },
    { name: '22:00', value: 45 },
  ];
  
  // Temperature data for charts
  export const temperatureData = [
    { name: '00:00', value: 68 },
    { name: '02:00', value: 65 },
    { name: '04:00', value: 67 },
    { name: '06:00', value: 70 },
    { name: '08:00', value: 72 },
    { name: '10:00', value: 75 },
    { name: '12:00', value: 78 },
    { name: '14:00', value: 80 },
    { name: '16:00', value: 77 },
    { name: '18:00', value: 75 },
    { name: '20:00', value: 72 },
    { name: '22:00', value: 70 },
  ];
  
  // Device data for tables
  export const deviceData = [
    {
      id: 1,
      name: 'Device A',
      workorderId: 'WO-2023-001',
      hubId: 'HUB-001',
      uptime: '10d 12h 45m',
      temperature: '72°C',
      productionRate: '60 units/hr',
      status: 'online',
    },
    {
      id: 2,
      name: 'Device B',
      workorderId: 'WO-2023-002',
      hubId: 'HUB-002',
      uptime: '8d 5h 20m',
      temperature: '68°C',
      productionRate: '55 units/hr',
      status: 'online',
    },
    {
      id: 3,
      name: 'Device C',
      workorderId: 'WO-2023-003',
      hubId: 'HUB-003',
      uptime: '15d 3h 12m',
      temperature: '85°C',
      productionRate: '45 units/hr',
      status: 'warning',
    },
    {
      id: 4,
      name: 'Device D',
      workorderId: 'WO-2023-004',
      hubId: 'HUB-004',
      uptime: '2d 8h 32m',
      temperature: '70°C',
      productionRate: '62 units/hr',
      status: 'online',
    },
    {
      id: 5,
      name: 'Device E',
      workorderId: 'WO-2023-005',
      hubId: 'HUB-005',
      uptime: '5d 16h 8m',
      temperature: '95°C',
      productionRate: '0 units/hr',
      status: 'error',
    },
    {
      id: 6,
      name: 'Device F',
      workorderId: 'WO-2023-006',
      hubId: 'HUB-006',
      uptime: '0d 0h 0m',
      temperature: '25°C',
      productionRate: '0 units/hr',
      status: 'offline',
    },
    {
      id: 7,
      name: 'Device G',
      workorderId: 'WO-2023-007',
      hubId: 'HUB-007',
      uptime: '1d 4h 15m',
      temperature: '50°C',
      productionRate: '0 units/hr',
      status: 'maintenance',
    },
  ];
  
  // Error data for tables
  export const errorData = [
    {
      id: 1,
      name: 'Device C',
      hubId: 'HUB-003',
      uptime: '15d 3h 12m',
      temperature: '85°C',
      alertCode: 'TEMP-001',
      suggestedAction: 'Monitor temperature',
    },
    {
      id: 2,
      name: 'Device E',
      hubId: 'HUB-005',
      uptime: '5d 16h 8m',
      temperature: '95°C',
      alertCode: 'TEMP-002',
      suggestedAction: 'Check cooling system',
    },
  ];
  
  // KPI data
  export const kpiData = {
    overall: {
      availability: 85,
      quality: 92,
      performance: 78,
      oee: 61,
    },
    monthly: [
      { month: 'Jan', availability: 82, quality: 90, performance: 75, oee: 55 },
      { month: 'Feb', availability: 84, quality: 91, performance: 76, oee: 58 },
      { month: 'Mar', availability: 83, quality: 92, performance: 77, oee: 59 },
      { month: 'Apr', availability: 85, quality: 93, performance: 78, oee: 62 },
      { month: 'May', availability: 87, quality: 92, performance: 79, oee: 63 },
      { month: 'Jun', availability: 86, quality: 91, performance: 80, oee: 63 },
    ],
  };
  
  // Configuration options
  export const configOptions = {
    alertThresholds: {
      temperature: {
        warning: 80,
        critical: 90,
      },
      uptime: {
        warning: '30d',
        critical: '45d',
      },
      production: {
        warning: 40,
        critical: 30,
      },
    },
    maintenance: {
      schedule: 'Monthly',
      lastPerformed: '2025-04-15',
      nextScheduled: '2025-05-15',
    },
  };