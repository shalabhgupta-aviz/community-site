'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!token) {
      console.log('token', token);
      router.replace('/login');
    } else {
      setIsAuthChecked(true);
    }
  }, [token, router]);

  if (!isAuthChecked) {
    return <div className="p-4">Redirecting to login...</div>;
  }

  return children;
}