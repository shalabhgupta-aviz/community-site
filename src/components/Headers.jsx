// src/components/Headers.jsx
"use client";

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { logout as logoutHelper } from '@/lib/auth';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      if (session) {
        await signOut({ callbackUrl: '/login' });
        toast.success('Logged out successfully');
      } else {
        logoutHelper();
        dispatch(logoutAction());
        toast.success('Logged out successfully');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  useEffect(() => {
    if (!user && token) {
      toast.error('User session is invalid. Please login again.');
      handleLogout();
    }
  }, [user, token]);

  const isLoggedIn = !!token && !!user;
  console.log("user", user);
  const userName = user?.first_name || user?.last_name || user?.username || 'User';

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-8"
          >
            <Link href="/" className="text-xl font-bold">Community</Link>
            <div className="flex space-x-4">
              <Link href="/topics" className="px-3 py-2 rounded-md hover:bg-gray-100">Topics</Link>
              <Link href="/questions" className="px-3 py-2 rounded-md hover:bg-gray-100">Questions</Link>
              <AnimatePresence>
                {isLoggedIn && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex space-x-4"
                  >
                    <Link href="/create-question" className="px-3 py-2 rounded-md hover:bg-gray-100">Create Questions</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <AnimatePresence mode="wait">
              {isLoggedIn ? (
                <motion.div
                  key="logged-in"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-4"
                >
                  <Link href="/profile" className="px-3 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile avatar"
                        className={`w-8 h-8 rounded-full ${user?.username ? 'mr-2' : ''}`}
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                          e.target.onerror = null;
                        }}
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center`}>
                        <span className="text-gray-500">{userName.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="logged-out"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-4"
                >
                  <Link href="/login" className="px-3 py-2 rounded-md hover:bg-gray-100">Login</Link>
                  <Link href="/register" className="px-3 py-2 rounded-md hover:bg-gray-100">Register</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
}