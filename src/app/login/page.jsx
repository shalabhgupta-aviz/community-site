'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { getToken, loginUser, register, setToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const { loading, error } = auth;
  const { data: session, status } = useSession();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  
  useEffect(() => {
    if (token && user) {
      router.replace('/profile');
    }
  }, [token, user]);
  
  useEffect(() => {
    const token = getToken();
    if (session?.user) {
      fetch('/api/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, name: session.user.name }),
      })
        .then((res) => res.json())
        .then(({ user }) => {
          if (user) {
            dispatch(loginSuccess({ user, token: token || 'social' }));
            router.replace('/profile'); // redirect if needed
          }
        });
    }
  }, [session]);

  useEffect(() => {
    const autoLoginWithSocial = async () => {
      if (session?.user?.email && session?.user?.name) {
        try {
          const res = await fetch('/api/social-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              username: session.user.name
            })
          });

          const data = await res.json();
          if (data.token && data.user) {
            dispatch(loginSuccess({ token: data.token, user: data.user }));
            setToken(data.token);
            router.replace('/profile');
          }
        } catch (err) {
          console.error('Social login failed', err);
        }
      }
    };

    autoLoginWithSocial();
  }, [session, dispatch, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      if (isRegister) {
        await register(username, email, password);
        const data = await loginUser(email, password);
        if (data.token) {
          dispatch(loginSuccess({ user: data.user, token: data.token }));
          setToken(data.token);
        }
      } else {
        const data = await loginUser(email, password);

        if (data.token) {
          dispatch(loginSuccess({ user: data.user, token: data.token }));
          setToken(data.token);
        }
      }
      router.push('/profile');
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {isRegister ? 'Create your account' : 'Make the most of your professional life'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="text-xs text-gray-500">
            By clicking {isRegister ? 'Create account' : 'Sign in'}, you agree to our{' '}
            <a href="#" className="text-blue-600 underline">Terms</a>,{' '}
            <a href="#" className="text-blue-600 underline">Privacy Policy</a>, and{' '}
            <a href="#" className="text-blue-600 underline">Cookie Policy</a>.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Loading...' : isRegister ? 'Agree & Join' : 'Sign in'}
          </button>

          <div className="relative py-2 text-center text-sm text-gray-400">
            <span className="bg-white px-2">or</span>
            <div className="absolute inset-x-0 top-1/2 border-t border-gray-200" />
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2 border rounded-md hover:bg-gray-50"
            onClick={() => signIn('google', { callbackUrl: '/login' })}
          >
            <img src='/google.svg' alt="Google" className="h-5 w-5" />
            Continue with Google
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2 border rounded-md hover:bg-gray-50"
            onClick={() => signIn('linkedin', { callbackUrl: '/login' })}
          >
            <img src="/linkedin.svg" alt="LinkedIn" className="h-5 w-5" />
            Continue with LinkedIn
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsRegister(false)} className="text-blue-600 underline">
                Sign in
              </button>
            </>
          ) : (
            <>
              New to the community?{' '}
              <button onClick={() => setIsRegister(true)} className="text-blue-600 underline">
                Create one
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}