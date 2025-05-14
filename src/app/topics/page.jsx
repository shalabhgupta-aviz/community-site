'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTopics } from '@/lib/topics';
import { decodeHtml } from '@/plugins/decodeHTMLentities';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await getTopics();
        setTopics(topicsData);
      } catch (err) {
        setError('Failed to load topics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4"
    >
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-bold mb-6"
      >
        Topics
      </motion.h1>

      {topics.length === 0 ? (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500"
        >
          No topics yet
        </motion.p>
      ) : (
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link
                href={{
                  pathname: `/topics/${(topic.title.rendered).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`,
                  query: { id: topic.id }
                }}
                className="block bg-white p-6 rounded-lg shadow-sm border hover:border-gray-300"
              >
                <h2 className="text-xl font-semibold mb-2">{decodeHtml(topic.title.rendered)}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: decodeHtml(topic.content.rendered) }} />
                <div className="text-sm text-gray-500">
                  <span>Status: {topic.status}</span>
                  <span className="mx-2">•</span>
                  <span>Type: {topic.type}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(topic.date).toLocaleDateString()}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
