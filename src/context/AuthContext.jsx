import React, { createContext, useState, useContext, useEffect } from 'react';

// Create authentication context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    if (isAuthenticated) {
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
    
    // Listen for storage events 
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Login function
  const login = (username, password) => {
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