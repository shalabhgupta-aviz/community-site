'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useGetCurrentUserQuery } from '@/store/api/wpApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };


  

  useEffect(() => {
    console.log('user', user);
  }, [user]);
  if (status === 'loading') return <div className="p-4">Loading...</div>;
  if (!session) return <div className="p-4 text-red-500">Please log in to view your profile</div>;

  return (
    <ProtectedRoute>
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center mb-6">
          {user.avatar_urls && (
            <img
              src={user.avatar_urls['96']}
              alt="Profile avatar"
              width={96}
              height={96}
              className="rounded-full"
            />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <p className="mt-1">{user.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <p className="mt-1">{user.username}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Roles</label>
            <p className="mt-1">{Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}</p>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}