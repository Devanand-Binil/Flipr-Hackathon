import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, uploadAvatar } from '../../api/users';

const UserProfile = () => {
  const { user, token, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    status: user?.status || '',
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const updatedProfile = await updateUserProfile(user.id, formData, token);
      updateUser(updatedProfile);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await uploadAvatar(user.id, file, token);
      updateUser({ avatar: result.avatarUrl });
      setSuccess('Avatar updated successfully');
    } catch (err) {
      setError('Failed to upload avatar');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-neutral-800 mb-6">Your Profile</h1>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm mb-4">
            {success}
          </div>
        )}
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar
              src={user?.avatar}
              alt={user?.name}
              size="xl"
              className="cursor-pointer"
              onClick={handleAvatarClick}
            />
            <div className="absolute bottom-0 right-0 bg-primary-500 text-white p-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <p className="text-sm text-neutral-500">Click to change avatar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            name="name"
            type="text"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            disabled
          />
          
          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          
          <div className="mb-4">
            <label 
              htmlFor="status" 
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="At work">At work</option>
              <option value="In a meeting">In a meeting</option>
              <option value="At the movies">At the movies</option>
              <option value="Battery about to die">Battery about to die</option>
              <option value="Can't talk, WhatsApp only">Can't talk, WhatsApp only</option>
            </select>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;