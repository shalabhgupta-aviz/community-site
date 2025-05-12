// src/app/questions/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { decodeHtml } from '@/plugins/decodeHTMLentities';
import { getQuestions } from '@/lib/questions';
import { getLatestRepliesInTopic, getRepliesForQuestion } from '@/lib/replies';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestionsWithReplies = async () => {
      try {
        const qs = await getQuestions();    
        console.log("qs", qs);                          // fetch all questions
        setQuestions(qs);
      } catch (err) {
        console.error(err);
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsWithReplies();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)   return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Questions</h1>
      {questions.length === 0 ? (
        <p className="text-gray-500">No questions yet</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <Link
              key={q.id}
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
              <p>Test</p>
              <div className="text-sm text-gray-500">
                <span>By {q.author}</span>
                <span className="mx-2">•</span>
                <span>{new Date(q.date).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{q.replyCount} {q.replyCount === 1 ? 'reply' : 'replies'}</span>
              </div>
              {q.latestReplySnippet && (
                <div className="mt-2 text-gray-400 italic line-clamp-1">
                  Latest: <span dangerouslySetInnerHTML={{ __html: decodeHtml(q.latestReplySnippet) }} />
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}