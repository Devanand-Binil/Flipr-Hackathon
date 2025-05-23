import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { 
  saveAuth, 
  getAuth, 
  removeAuth, 
  isAuthenticated as checkAuth,
  getCurrentUser,
  getToken,
  updateUserData
} from '../services/authService';
import { loginUser, registerUser, requestPasswordReset } from '../api/auth';

// Create the context
export const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        if (checkAuth()) {
          const authData = getAuth();
          setUser(authData.user);
          setToken(authData.token);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loginUser(credentials);
      
      if (response.success) {
        saveAuth({
          user: response.user,
          token: response.token
        });
        
        setUser(response.user);
        setToken(response.token);
        return true;
      } else {
        setError(response.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await registerUser(userData);
      
      if (response.success) {
        saveAuth({
          user: response.user,
          token: response.token
        });
        
        setUser(response.user);
        setToken(response.token);
        return true;
      } else {
        setError(response.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    removeAuth();
    setUser(null);
    setToken(null);
  }, []);

  // Request password reset
  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await requestPasswordReset(email);
      return response.success;
    } catch (err) {
      setError(err.message || 'Password reset request failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile in context and storage
  const updateUser = useCallback((userData) => {
    updateUserData(userData);
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  }, []);

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    forgotPassword,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};