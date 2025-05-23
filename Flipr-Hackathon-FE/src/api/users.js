const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

/**
 * Get user profile
 * @param {string} userId - User ID
 * @param {string} token - JWT token
 * @returns {Promise} - Promise with user profile data
 */
export const getUserProfile = async (userId, token) => {
  try {
    // In a real app, this would be an actual API call
    // const response = await fetch(`${API_URL}/users/${userId}`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    // return await response.json();
    
    // For demo purposes, simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          name: 'Demo User',
          email: 'demo@example.com',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          phone: '+1234567890',
          status: 'Available',
          createdAt: '2023-01-15T00:00:00.000Z'
        });
      }, 500);
    });
  } catch (error) {
    console.error('Get profile error:', error);
    throw new Error('Failed to fetch user profile. Please try again.');
  }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Updated profile data
 * @param {string} token - JWT token
 * @returns {Promise} - Promise with updated user profile
 */
export const updateUserProfile = async (userId, profileData, token) => {
  try {
    // In a real app, this would be an actual API call
    // const response = await fetch(`${API_URL}/users/${userId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(profileData)
    // });
    // return await response.json();
    
    // For demo purposes, simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...profileData,
          id: userId,
          updatedAt: new Date().toISOString()
        });
      }, 600);
    });
  } catch (error) {
    console.error('Update profile error:', error);
    throw new Error('Failed to update profile. Please try again.');
  }
};

/**
 * Upload user avatar
 * @param {string} userId - User ID
 * @param {File} imageFile - Image file
 * @param {string} token - JWT token
 * @returns {Promise} - Promise with avatar URL
 */
export const uploadAvatar = async (userId, imageFile, token) => {
  try {
    // In a real app, this would be an actual API call with FormData
    // const formData = new FormData();
    // formData.append('avatar', imageFile);
    
    // const response = await fetch(`${API_URL}/users/${userId}/avatar`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   },
    //   body: formData
    // });
    // return await response.json();
    
    // For demo purposes, simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would be the URL of the uploaded image
        const randomAvatar = Math.floor(Math.random() * 100);
        const gender = Math.random() > 0.5 ? 'men' : 'women';
        const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${randomAvatar}.jpg`;
        
        resolve({
          success: true,
          avatarUrl
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    throw new Error('Failed to upload avatar. Please try again.');
  }
};