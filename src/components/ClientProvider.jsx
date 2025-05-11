'use client';
import { Provider } from 'react-redux';
import store from '@/store';
import { SessionProvider } from 'next-auth/react';
import { getSession, getToken, getUserProfile } from '@/lib/auth';
import { loginSuccess } from '@/store/slices/authSlice';
import { useEffect, useState } from 'react';

export default function ClientProvider({ children }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (token) {
      getUserProfile(token)
        .then((user) => {
          store.dispatch(loginSuccess({ token, user }));
        })
        .finally(() => setIsReady(true));
    } else {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return <div className="p-4">Loading session...</div>; // Or a spinner
  }

  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}