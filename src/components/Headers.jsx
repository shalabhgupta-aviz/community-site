// src/components/Headers.jsx
"use client";

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { logout as logoutHelper } from '@/lib/auth';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const { data: session } = useSession(); // ✅ Google/LinkedIn session support

  const handleLogout = () => {
    if (session) {
      // Google/LinkedIn logout
      signOut({ callbackUrl: '/login' });
    } else {
      // JWT logout
      logoutHelper();
      dispatch(logoutAction());
    }
  };

  const isLoggedIn = !!token && !!user;
  const userName = user?.name || user?.username || 'Profile';

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
                  {userName.charAt(0).toUpperCase() + userName.slice(1)}
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