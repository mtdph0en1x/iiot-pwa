import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ImprovedNavbar from './components/ImprovedNavbar';
import Dashboard from './pages/Dashboard';
import LiveData from './pages/LiveData';
import Logs from './pages/Logs';
import KPI from './pages/KPI';
import Errors from './pages/Errors';
import Configuration from './pages/Configuration';
import DeviceDetail from './pages/DeviceDetail';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page and save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Redirect if already authenticated
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is already logged in and tries to access login page,
  // redirect to the page they came from or dashboard
  if (isAuthenticated && location.pathname === '/login') {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <ImprovedNavbar />}
      <div className={`${isAuthenticated ? 'pt-16 min-h-[calc(100vh-64px)]' : 'min-h-screen'} bg-gray-50`}>
        <div className={`${isAuthenticated ? 'container mx-auto px-4 py-6' : ''}`}>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/live-data" element={
              <ProtectedRoute>
                <LiveData />
              </ProtectedRoute>
            } />
            <Route path="/logs" element={
              <ProtectedRoute>
                <Logs />
              </ProtectedRoute>
            } />
            <Route path="/kpi" element={
              <ProtectedRoute>
                <KPI />
              </ProtectedRoute>
            } />
            <Route path="/errors" element={
              <ProtectedRoute>
                <Errors />
              </ProtectedRoute>
            } />
            <Route path="/configuration" element={
              <ProtectedRoute>
                <Configuration />
              </ProtectedRoute>
            } />
            <Route path="/device/:id" element={
              <ProtectedRoute>
                <DeviceDetail />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>       
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;