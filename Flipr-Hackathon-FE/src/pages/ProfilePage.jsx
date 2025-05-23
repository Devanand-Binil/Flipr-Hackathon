import UserProfile from '../components/profile/UserProfile';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-neutral-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 px-4">
          <h1 className="text-2xl font-bold text-neutral-800">Account Settings</h1>
          <p className="text-neutral-600">Manage your profile and preferences</p>
        </div>
        
        <UserProfile />
      </div>
    </div>
  );
};

export default ProfilePage;