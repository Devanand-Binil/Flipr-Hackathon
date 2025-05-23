const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise with registration response
 */
export const registerUser = async (userData) => {
  try {
    // In a real app, this would be an actual API call
    // const response = await fetch(`${API_URL}/auth/register`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(userData)
    // });
    // return await response.json();
    
    // For demo purposes, simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Registration successful',
          user: {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            name: userData.name,
            email: userData.email,
            avatar: null
          },
          token: 'demo_jwt_token_' + Math.random().toString(36).substr(2, 16)
        });
      }, 800);
    });
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Registration failed. Please try again.');
  }
};

/**
 * Login a user
 * @param {Object} credentials - Login credentials
 * @returns {Promise} - Promise with login response
 */
export const loginUser = async (credentials) => {
  try {
    // In a real app, this would be an actual API call
    // const response = await fetch(`${API_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // });
    // return await response.json();
    
    // For demo purposes, simulate API response
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo validation
        if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
          resolve({
            success: true,
            message: 'Login successful',
            user: {
              id: 'user_1234567890',
              name: 'Demo User',
              email: credentials.email,
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            token: 'demo_jwt_token_' + Math.random().toString(36).substr(2, 16)
          });
        } else {
          reject({ message: 'Invalid email or password' });
        }
      }, 800);
    });
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed. Please try again.');
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} - Promise with password reset response
 */
export const requestPasswordReset = async (email) => {
  try {
    // In a real app, this would be an actual API call
    // const response = await fetch(`${API_URL}/auth/reset-password`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email })
    // });
    // return await response.json();
    
    // For demo purposes, simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Password reset instructions sent to your email'
        });
      }, 800);
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    throw new Error('Password reset request failed. Please try again.');
  }
};

/**
 * Reset password with token
 * @param {Object} resetData - Password reset data including token
 * @returns {Promise} - Promise with password reset confirmation
 */
export const resetPassword = async (resetData) => {
  try {
    // In a real app, this would be an actual API call
    // const response = await fetch(`${API_URL}/auth/reset-password/confirm`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(resetData)
    // });
    // return await response.json();
    
    // For demo purposes, simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Password has been successfully reset'
        });
      }, 800);
    });
  } catch (error) {
    console.error('Password reset error:', error);
    throw new Error('Password reset failed. Please try again.');
  }
};