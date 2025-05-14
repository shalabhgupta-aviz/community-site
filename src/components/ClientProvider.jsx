// src/components/ClientProvider.jsx
'use client';
import { Provider } from 'react-redux';
import store from '@/store';
import { SessionProvider, useSession } from 'next-auth/react';
import { getToken, getUserProfile } from '@/lib/auth';
import { loginSuccess } from '@/store/slices/authSlice';
import { useEffect, useState } from 'react';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import loadingSpinner from '/public/animations/loaderSpinner.json'
import Lottie from 'lottie-react';
import { SpeedInsights } from "@vercel/speed-insights/next"

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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sync = async () => {
      const token = getToken();
      if (token) {
        try {
          const user = await getUserProfile(token);
          store.dispatch(loginSuccess({ token, user }));
        } catch (e) {
          console.warn('JWT session fetch failed');
        }
      } else if (session?.user?.email) {
        const res = await fetch('/api/social-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session.user.email,
            name: session.user.name,
          }),
        });

        const { user } = await res.json();
        store.dispatch(loginSuccess({ user, token: 'social' }));
      }
      setIsReady(true);
    };
    sync();
  }, [session]);

  if (!isReady || status === 'loading') return (
    <div className="flex justify-center items-center min-h-screen">
      <Lottie
        animationData={loadingSpinner}
        loop={true}
        style={{ width: '200px', height: '200px' }}
      />
    </div>
  );
  return <Provider store={store}>{children}</Provider>;
}