import React, { createContext, useState, useContext, useEffect } from 'react';

// Create authentication context
const AuthContext = createContext();

// Hook to use the auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

// Provider component
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [user, setUser] = useState(null);

  // Effect to initialize user data
  useEffect(() => {
    if (isAuthenticated) {
      // In a real application, you would fetch user profile data from an API
      // For this demo, we're setting some hardcoded user data
      setUser({
        username: 'admin',
        role: 'Administrator',
        name: 'Admin User',
        email: 'admin@example.com',
        lastLogin: new Date().toISOString()
      });
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(auth);
    };
    
    // Check initially
    checkAuth();
    
    // Listen for storage events (in case of multiple tabs)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Login function
  const login = (username, password) => {
    // In a real application, you would validate credentials against an API
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem('isAuthenticated');
    // Update state
    setIsAuthenticated(false);
    setUser(null);
  };

  // Provide the context value to children
  const contextValue = {
    isAuthenticated,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}