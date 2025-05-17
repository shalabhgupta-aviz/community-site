// src/components/Headers.jsx
'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell } from 'react-icons/fi';
import Image from 'next/image';
import { useNotifications } from '@/hooks/useNotifications';

export default function Header() {
  const { data: session, status } = useSession();
  const reduxUser = useSelector((s) => s.auth.user);
  const user = reduxUser || session?.user;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { notifications, loading: notificationsLoading, error: notificationsError } = useNotifications();
  
  const notificationsRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(false);
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur shadow-md"
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/aviz-logo.png" alt="Aviz Community" width={170} height={100} />
        </Link>

        {/* Center links */}
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li>
            <Link href="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/questions" className="hover:text-indigo-600 transition">
              Open Forum
            </Link>
          </li>
          <li>
            <Link href={`${process.env.NEXT_PUBLIC_AVIZ_LIVE_SITE}/resources/blogs/`} target="_blank" className="hover:text-indigo-600 transition">
              Resources
            </Link>
          </li>
          <li>
            <Link href={`${process.env.NEXT_PUBLIC_AVIZ_LIVE_SITE}/resources/events/bootcamps/`} target="_blank" className="hover:text-indigo-600 transition">
              Events
            </Link>
          </li>
        </ul>

        {/* Right controls */}
        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <FiBell className="w-5 h-5 text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="px-4 py-3">
                      <p className="text-sm">Loading notifications...</p>
                    </div>
                  ) : notificationsError ? (
                    <div className="px-4 py-3">
                      <p className="text-sm text-red-500">Error loading notifications</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-3">
                      <p className="text-sm">No new notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={handleNotificationClick}
                      >
                        <p className="text-sm">{notification.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {status === 'loading' ? (
              // small pulse while NextAuth is initializing
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              // logged-in
              <motion.div
                key="logged-in"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-3 relative"
                ref={profileDropdownRef}
              >
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 mr-1"
                >
                  {user.avatar || user.image ? (
                    <Image
                      src={user.avatar || user.image}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600">
                        {user.name?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              // not logged-in
              <motion.div
                key="logged-out"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex space-x-3"
              >
                <Link
                  href="/login"
                  className="px-4 py-1 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition"
                >
                  Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.header>
  );
}