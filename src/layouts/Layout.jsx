"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUser } from '@/lib/auth';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold">
                Community
              </Link>
              <div className="flex space-x-4">
                <Link 
                  href="/topics"
                  className="px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Topics
                </Link>
                <Link 
                  href="/questions"
                  className="px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Questions
                </Link>
                
                {user && (
                  <>
                    <Link 
                      href="/create-topic"
                      className="px-3 py-2 rounded-md hover:bg-gray-100"
                    >
                      Create Topic
                    </Link>
                    <Link
                      href="/my-replies"
                      className="px-3 py-2 rounded-md hover:bg-gray-100"
                    >
                      My Replies
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 rounded-md hover:bg-gray-100"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
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
