// src/components/ProtectedRoute.jsx
'use client';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/auth';

export default function ProtectedRoute({ children }) {
  const [authReady, setAuthReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const tokenFromCookie = getToken();
      if (!tokenFromCookie) {
        router.replace('/login');
      } else {
        setAuthReady(true);
      }
    };

    checkAuth();
  }, [router]);

  if (!authReady) {
    return <div className="p-4">Checking auth...</div>;
  }

  return children;
}