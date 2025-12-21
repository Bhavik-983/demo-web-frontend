import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserList from '../components/manager/UserList';
import ProfileCard from '../components/profile/ProfileCard';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { updateProfileApi } from '../services/api';
import { showError, showSuccess } from '../utils/toast';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('#profile-dropdown') === null &&
        event.target.closest('#profile-button') === null) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, []);

  const handleProfileUpdate = async (data) => {
    try {
      const updateData = await updateProfileApi(data);
      // Refresh user data
      showSuccess(updateData.message);
    } catch (error) {
      showError(error.message || 'Failed to update profile');
      throw error;
    }
  };

  return (
<div className="min-h-screen bg-gray-100">
  <nav className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">Manager Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 focus:outline-none"
              id="profile-button"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </button>

            {showProfile && (
              <div id="profile-dropdown" className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <ProfileCard 
                  user={user} 
                  onClose={() => setShowProfile(false)} 
                  onUpdate={handleProfileUpdate} 
                />
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </nav>

  <div className="py-10">
    <main>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          <UserList />
        </div>
      </div>
    </main>
  </div>
</div>
  );
};

export default ManagerDashboard;