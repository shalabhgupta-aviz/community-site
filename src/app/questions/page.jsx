// src/app/questions/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { decodeHtml } from '@/plugins/decodeHTMLentities';
import { getQuestions } from '@/lib/questions';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import loadingSpinner from '/public/animations/loaderSpinner.json';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const qs = await getQuestions(page, 10);    
        console.log("qs", qs);                          
        setQuestions(prev => page === 1 ? qs : [...prev, ...qs]);
        setHasMore(qs.length === 10); // If we get less than 10 items, we've reached the end
      } catch (err) {
        console.error(err);
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) return (
    <div className="flex justify-center items-center min-h-screen">
      <Lottie
        animationData={loadingSpinner}
        loop={true}
        style={{ width: '200px', height: '200px' }}
      />
    </div>
  );
  if (error) return <div className="p-4 text-red-500">{error}</div>;

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
        Questions
      </motion.h1>
      {questions.length === 0 ? (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500"
        >
          No questions yet
        </motion.p>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link
                href={{
                  pathname: `/questions/${q.title.rendered
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')}`,
                  query: { id: q.id }
                }}
                className="block bg-white p-6 rounded-lg shadow-sm border hover:border-gray-300"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {decodeHtml(q.title.rendered)}
                </h2>
                <p
                  className="text-gray-600 mb-4 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: decodeHtml(q.content.rendered) }}
                />
                <div className="text-sm text-gray-500">
                  <span>By {q.bbp_extra?.author?.name || 'Anonymous'}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(q.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{q.bbp_extra?.reply_count || 0} {q.bbp_extra?.reply_count === 1 ? 'reply' : 'replies'}</span>
                </div>
                {q.bbp_extra?.last_reply_content && (
                  <div className="mt-2 text-gray-400 italic line-clamp-1">
                    Latest: <span dangerouslySetInnerHTML={{ __html: decodeHtml(q.bbp_extra.last_reply_content) }} />
                  </div>
                )}
              </Link>
            </motion.div>
          ))}

          {hasMore && !loading && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={loadMore}
              className="w-full p-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
            >
              Load more questions
            </motion.button>
          )}

          {loading && page > 1 && (
            <div className="flex justify-center p-4">
              <Lottie
                animationData={loadingSpinner}
                loop={true}
                style={{ width: '100px', height: '100px' }}
              />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}