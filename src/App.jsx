import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LiveData from './pages/LiveData';
import Logs from './pages/Logs';
import KPI from './pages/KPI';
import Errors from './pages/Errors';
import Configuration from './pages/Configuration';
import DeviceDetail from './pages/DeviceDetail';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-[60px] h-[calc(100vh-60px)]">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/live-data" element={<LiveData />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/kpi" element={<KPI />} />
          <Route path="/errors" element={<Errors />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/device/:id" element={<DeviceDetail />} />
        </Routes>       
      </div>
      
    </Router>
  );
}

export default App;
