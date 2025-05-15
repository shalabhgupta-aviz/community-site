// src/components/ClientProvider.jsx
'use client';

import { Provider } from 'react-redux';
import store from '@/store';
import { SessionProvider, useSession } from 'next-auth/react';
import { getToken, setToken, getUserProfile } from '@/lib/auth';
import { loginSuccess, setUser } from '@/store/slices/authSlice';
import { useEffect, useState } from 'react';
import loadingSpinner from '/public/animations/loaderSpinner.json';
import Lottie from 'lottie-react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientProvider({ children }) {
  return (
    <SessionProvider>
      <ReduxSessionSync>
        {children}
        <SpeedInsights />
      </ReduxSessionSync>
    </SessionProvider>
  );
}

function ReduxSessionSync({ children }) {
  const { data: session, status } = useSession();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function sync() {
      // 1️⃣ If NextAuth gave us a WP JWT, use it
      if (session?.wpJwt) {
        setToken(session.wpJwt);
        try {
          const user = await getUserProfile(session.wpJwt);
          store.dispatch(loginSuccess({ token: session.wpJwt, user }));
          store.dispatch(setUser(user));
        } catch (err) {
          console.error('Failed to fetch WP profile after social login:', err);
          toast.error('Failed to load user profile');
        }
      }
      // 2️⃣ Otherwise fall back to our existing cookie if present
      else {
        const token = getToken();
        if (token) {
          try {
            const user = await getUserProfile(token);
            store.dispatch(loginSuccess({ token, user }));
            store.dispatch(setUser(user));
          } catch (err) {
            console.error('JWT session fetch failed:', err);
            toast.error('Failed to restore session');
          }
        }
      }

      setReady(true);
    }

    if (status !== 'loading') sync();
  }, [session, status]);

  if (!ready || status === 'loading') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center min-h-screen"
      >
        <Lottie
          animationData={loadingSpinner}
          loop
          style={{ width: 200, height: 200 }}
        />
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Provider store={store}>{children}</Provider>
    </AnimatePresence>
  );
}