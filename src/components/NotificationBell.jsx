'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { FaRegBell } from 'react-icons/fa';
import { getNotifications, markOneAsRead, markAllAsRead } from '@/lib/notifications';
import { getToken } from '@/lib/auth';
import TimeDifferenceFormat from './TImeDifferenceFormat';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsBell() {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1] || '';

  const { data = [], error, mutate } = useSWR(
    'notifications',
    () => getNotifications(token),
    { refreshInterval: 300000 }
  );

  // only count the ones that are still unread:
  const unreadCount = data.filter(n => !n.read).length;

  const [open, setOpen] = useState(false);
  const prevCount = useRef(0);
  const containerRef = useRef(null);

  // Auto-open when new arrive
  useEffect(() => {
    if (data.length > prevCount.current) setOpen(true);
    prevCount.current = data.length;
  }, [data.length]);

  // Close on outside click
  useEffect(() => {
    const onClick = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (error) return null;

  // Mark one as read
  const markAsRead = async (id) => {
    // optimistic remove
    mutate(
      data.map(n => (n.id === id ? { ...n, read: true } : n)),
      false
    );
    await markOneAsRead(id, token);
    // revalidate
    mutate();
  };

  // Mark all as read
  const markAllRead = async () => {
    mutate(data.map(n => ({ ...n, read: true })), false);

    await markAllAsRead(token);
    mutate();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button onClick={() => setOpen(o => !o)} className="p-2">
        <FaRegBell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white shadow-lg rounded-lg z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="font-medium">Notifications</span>
              {data.length > 0 && (
                <button 
                  onClick={markAllRead}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <ul>
              {data.length > 0 ? data.map(n => (
                <motion.li
                  key={n.id}
                  className={`flex items-start px-4 py-2 hover:bg-gray-100 ${n.read ? 'bg-gray-300' : 'bg-white'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="checkbox"
                    className="mt-1 mr-2"
                    checked={n.read || false} // Ensure controlled input
                    onChange={() => markAsRead(n.id)}
                  />
                  <div className="flex-1">
                    <div
                      className="cursor-pointer font-sm"
                      onClick={async () => {
                        const questionLink = `/questions/${n.topic_slug}?id=${n.topic_id}`;

                        // 1) optimistically mark read in our SWR cache
                        mutate(
                          data.map(x => (x.id === n.id ? { ...x, read: true } : x)),
                          false
                        );

                        // 2) wait for the server to actually mark it
                        await markOneAsRead(n.id, token);

                        // 3) now navigate — server is in sync
                        window.location.assign(questionLink);
                      }}
                    >
                      {n.message}
                    </div>
                    <div className="text-xs text-gray-500">
                      <TimeDifferenceFormat date={n.date} />
                    </div>
                  </div>
                </motion.li>
              )) : (
                <li className="px-4 py-2 text-gray-500">No new notifications</li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}