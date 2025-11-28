import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ImprovedNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Live Data', path: '/live-data' },
    { name: 'Logs', path: '/logs' },
    { name: 'KPI', path: '/kpi' },
    { name: 'Errors', path: '/errors' },
    { name: 'Configuration', path: '/configuration' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = (e) => {
    e.preventDefault();
    // Use the logout function from the auth context
    logout();
    
    // Close profile dropdown
    setIsProfileOpen(false);
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 text-white fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo and brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/src/assets/react.svg" alt="Logo" className="h-8 w-8" />
            <span className="font-bold text-xl hidden md:block">IIoT Dashboard</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                isActive(item.path)
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User menu and notifications */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              type="button"
              className="p-1 rounded-full text-slate-300 hover:text-white focus:outline-none"
              onClick={() => {
                setNotificationCount(0);
              }}
            >
              <Bell className="h-6 w-6" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white text-center">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="hidden lg:block">{user?.name || 'Admin User'}</span>
              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-blue-500">Your Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-blue-500">Settings</span>
                </Link>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-200 bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-red-500">Sign out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-1 text-slate-300 hover:text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-700 hover:text-red-300"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}