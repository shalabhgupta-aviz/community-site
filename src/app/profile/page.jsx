'use client';

import { useGetCurrentUserQuery } from '@/store/api/wpApi';

export default function ProfilePage() {
  const { data: user, error, isLoading } = useGetCurrentUserQuery();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Failed to fetch user profile</div>;
  if (!user) return <div className="p-4">Please log in to view your profile</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

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
  );
}