'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProtectedRoute from '@/components/ProtectedRoute';
import { decodeHtml } from '@/plugins/decodeHTMLentities';
import Link from 'next/link';

export default function MyRepliesPage() {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${API_BASE_URL}/replies/my-replies`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        setReplies(data);
      } catch (err) {
        setError('Failed to load replies');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReplies();
    }
  }, [user]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <ProtectedRoute>

      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Replies</h1>

        {replies.length === 0 ? (
          <p className="text-gray-500">You haven't made any replies yet</p>
        ) : (
          <div className="space-y-4">

            {
                replies.length > 0 ? (
                    replies.map((reply) => (
                        <Link
                              key={reply.id}
                              href={{
                                pathname: `/questions/${reply.question_id}`,
                                query: { replyId: reply.id }
                              }}
                              className="block bg-white p-6 rounded-lg shadow-sm border hover:border-gray-300"
                            >
                              <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: decodeHtml(reply.content.rendered) }} />
                              <div className="text-sm text-gray-500">
                                <span>{new Date(reply.date).toLocaleDateString()}</span>
                              </div>
                            </Link>
                          )
                      )
                ) :
                (
                    <p className="text-gray-500">You haven't made any replies yet</p>
                )
            }
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
