"use client";

import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { logout as logoutHelper } from '@/lib/auth';
import { useGetCurrentUserQuery } from '@/store/api/wpApi';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const dispatch = useDispatch();
  const { data: wpUser } = useGetCurrentUserQuery();
  const { data: session } = useSession(); // NextAuth session

  const handleLogout = () => {
    // If using Google/LinkedIn
    if (session) {
      signOut({ callbackUrl: '/login' });
    } else {
      // JWT-based logout
      logoutHelper();
      dispatch(logoutAction());
    }
  };

  const isLoggedIn = !!session || !!wpUser;
  const userName = session?.user?.name || wpUser?.name;

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">Community</Link>
            <div className="flex space-x-4">
              <Link href="/topics" className="px-3 py-2 rounded-md hover:bg-gray-100">Topics</Link>
              <Link href="/questions" className="px-3 py-2 rounded-md hover:bg-gray-100">Questions</Link>
              {isLoggedIn && (
                <>
                  <Link href="/create-topic" className="px-3 py-2 rounded-md hover:bg-gray-100">Create Topic</Link>
                  <Link href="/my-replies" className="px-3 py-2 rounded-md hover:bg-gray-100">My Replies</Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="px-3 py-2 rounded-md hover:bg-gray-100">
                  {userName || 'Profile'}
                </Link>
                <button onClick={handleLogout} className="px-3 py-2 rounded-md hover:bg-gray-100">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 rounded-md hover:bg-gray-100">Login</Link>
                <Link href="/register" className="px-3 py-2 rounded-md hover:bg-gray-100">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}