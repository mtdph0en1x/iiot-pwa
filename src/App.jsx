import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ImprovedNavbar from './components/ImprovedNavbar';
import Dashboard from './pages/Dashboard';
import LiveData from './pages/LiveData';
import Logs from './pages/Logs';
import KPI from './pages/KPI';
import KPIDetail from './pages/KPIDetail';
import Errors from './pages/Errors';
import Configuration from './pages/Configuration';
import DeviceDetail from './pages/DeviceDetail';

function App() {
  return (
    <Router>
      <ImprovedNavbar />
      <div className="pt-16 min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live-data" element={<LiveData />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/kpi" element={<KPI />} />
            <Route path="/kpi/detail" element={<KPIDetail />} />
            <Route path="/errors" element={<Errors />} />
            <Route path="/configuration" element={<Configuration />} />
            <Route path="/device/:id" element={<DeviceDetail />} />
          </Routes>       
        </div>
      </div>
      
    </Router>
  );
}

export default App;