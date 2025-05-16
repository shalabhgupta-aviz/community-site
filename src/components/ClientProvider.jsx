// src/components/ClientProvider.jsx
'use client';

import { Provider, useSelector, useDispatch } from 'react-redux';
import store from '@/store';
import { SessionProvider, useSession } from 'next-auth/react';
import { getToken, setToken } from '@/lib/auth';
import { loginSuccess, setUser } from '@/store/slices/authSlice';
import { getUserProfile } from '@/lib/auth';
import { useEffect, useState } from 'react';
import loadingSpinner from '/public/animations/loaderSpinner.json';
import Lottie from 'lottie-react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ClientProvider({ children }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ReduxSessionSync>
          {children}
          <SpeedInsights />
        </ReduxSessionSync>
      </Provider>
    </SessionProvider>
  );
}

function ReduxSessionSync({ children }) {
  const { data: session, status } = useSession();
  const reduxUser = useSelector(state => state.auth.user);
  const dispatch  = useDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function sync() {
      try {
        let fetchedUser = null;
        if (session?.wpJwt) {
          setToken(session.wpJwt);
          fetchedUser = await getUserProfile(session.wpJwt);
        } else {
          const token = getToken();
          if (token) fetchedUser = await getUserProfile(token);
        }
        if (fetchedUser) {
          // merge without overwriting local changes
          const mergedUser = { ...fetchedUser, ...reduxUser };
          if (JSON.stringify(mergedUser) !== JSON.stringify(reduxUser)) {
            dispatch(loginSuccess({ token: session?.wpJwt || getToken(), user: mergedUser }));
          }
        }
      } catch (err) {
        console.error('Failed to sync session:', err);
        toast.error('Failed to sync user session.');
      } finally {
        setReady(true);
      }
    }
    if (status !== 'loading') sync();
  }, [session, status, reduxUser, dispatch]);

  if (!ready || status === 'loading') {
    return (
      <motion.div className="flex justify-center items-center min-h-screen">
        <Lottie animationData={loadingSpinner} loop style={{ width: 200, height: 200 }} />
      </motion.div>
    );
  }

  // Render children directly—no AnimatePresence wrapper
  return <>{children}</>;
}
