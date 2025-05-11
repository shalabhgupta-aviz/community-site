"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUser } from '@/lib/auth';
import Header from '@/components/Headers';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useGetCurrentUserQuery } from '@/store/api/wpApi';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { data: wpUser } = useGetCurrentUserQuery();
  const token = useSelector(state => state.auth.token);

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    if (session) {
      dispatch(loginSuccess({ user: session.user, token: session.token }));
    } else if (wpUser) {
      dispatch(loginSuccess({ user: wpUser, token: token }));
    }
  }, [useSession, useGetCurrentUserQuery, useSelector]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500">© 2024 Community. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
