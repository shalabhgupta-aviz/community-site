'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { getToken, loginUser, register, setToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  const user = useSelector((state) => state.auth.user || session?.user);

  useEffect(() => {
    if (token && user) {
      router.replace('/profile');
    }
  }, [token, user, router]);

  useEffect(() => {
    if (session?.user) {
      dispatch(loginSuccess({
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          username: session.user.username,
          avatar: session.user.image
        },
        token: session.wpJwt
      }));
      router.replace('/profile');
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg"
      >
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-semibold mb-6 text-center"
        >
          {isRegister ? 'Create your account' : 'Make the most of your professional life'}
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </motion.div>
          )}

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-gray-500"
          >
            By clicking {isRegister ? 'Create account' : 'Sign in'}, you agree to our{' '}
            <a href="#" className="text-blue-600 underline">Terms</a>,{' '}
            <a href="#" className="text-blue-600 underline">Privacy Policy</a>, and{' '}
            <a href="#" className="text-blue-600 underline">Cookie Policy</a>.
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? (
              <LoadingSpinner />
            ) : isRegister ? 'Agree & Join' : 'Sign in'}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="relative py-2 text-center text-sm text-gray-400"
          >
            <span className="bg-white px-2">or</span>
            <div className="absolute inset-x-0 top-1/2 border-t border-gray-200" />
          </motion.div>

          {/* <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="w-full flex items-center justify-center gap-3 py-2 border rounded-md hover:bg-gray-50"
            onClick={() => signIn('google', { callbackUrl: '/login' })}
          >
            <img src='/google.svg' alt="Google" className="h-5 w-5" />
            Continue with Google
          </motion.button>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="w-full flex items-center justify-center gap-3 py-2 border rounded-md hover:bg-gray-50"
            onClick={() => signIn('linkedin', { callbackUrl: '/login' })}
          >
            <img src="/linkedin.svg" alt="LinkedIn" className="h-5 w-5" />
            Continue with LinkedIn
          </motion.button> */}
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center text-sm"
        >
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
}