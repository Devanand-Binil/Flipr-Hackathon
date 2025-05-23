import { jwtDecode } from 'jwt-decode';

// Key for storing auth data in localStorage
const AUTH_KEY = 'whatsapp_clone_auth';

/**
 * Save authentication data to localStorage
 * @param {Object} authData - Authentication data including token and user info
 */
export const saveAuth = (authData) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
};

/**
 * Get authentication data from localStorage
 * @returns {Object|null} - Auth data or null if not authenticated
 */
export const getAuth = () => {
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    return authData ? JSON.parse(authData) : null;
  } catch (error) {
    console.error('Failed to parse auth data:', error);
    return null;
  }
};

/**
 * Remove authentication data from localStorage (logout)
 */
export const removeAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};

/**
 * Check if the user is authenticated
 * @returns {boolean} - True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const authData = getAuth();
  if (!authData || !authData.token) {
    return false;
  }
  
  try {
    // Check if token is expired
    const decoded = jwtDecode(authData.token);
    const currentTime = Date.now() / 1000;
    
    // If token has exp claim and it's in the past, token is expired
    if (decoded.exp && decoded.exp < currentTime) {
      removeAuth(); // Clean up expired token
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return false;
  }
};

/**
 * Get current user from stored auth data
 * @returns {Object|null} - User object or null if not authenticated
 */
export const getCurrentUser = () => {
  const authData = getAuth();
  return authData && authData.user ? authData.user : null;
};

/**
 * Get authentication token
 * @returns {string|null} - JWT token or null if not authenticated
 */
export const getToken = () => {
  const authData = getAuth();
  return authData && authData.token ? authData.token : null;
};

/**
 * Update stored user data (e.g., after profile update)
 * @param {Object} userData - Updated user data
 */
export const updateUserData = (userData) => {
  const authData = getAuth();
  if (authData) {
    saveAuth({
      ...authData,
      user: {
        ...authData.user,
        ...userData
      }
    });
  }
};