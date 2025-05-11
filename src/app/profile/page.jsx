// src/app/profile/page.jsx
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/slices/authSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      {!user ? (
        <div className="p-4">Loading...</div>
      ) : (
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
            {user.avatar_urls && (
              <img
                src={user.avatar_urls['96']}
                alt="Profile avatar"
                className="rounded-full mb-6"
                width={96}
                height={96}
              />
            )}

            <div className="space-y-4">
              <Info label="User ID" value={user.id} />
              <Info label="Email" value={user.email} />
              <Info label="Username" value={user.username} />
              <Info label="Roles" value={Array.isArray(user.roles) ? user.roles.join(', ') : user.roles} />
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="mt-1">{value}</p>
    </div>
  );
}