'use client';

import { useState, useEffect } from 'react';
import { getQuestionDetails } from '@/lib/questions';
import { getRepliesForQuestion } from '@/lib/replies';
import { decodeHtml } from '@/plugins/decodeHTMLentities';

export default function UserPage() {
  const [userData, setUserData] = useState({
    topics: [],
    replies: [],
    details: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user details from API
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const userDetails = await userResponse.json();

        // Get user's topics
        const topicsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/topic?author=${userDetails.id}`);
        const topics = await topicsResponse.json();

        // Get user's replies
        const repliesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reply?author=${userDetails.id}`);
        const replies = await repliesResponse.json();

        setUserData({
          topics,
          replies,
          details: userDetails
        });
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* User Details Section */}
      {userData.details && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={userData.details.avatar_urls?.['96']} 
              alt={userData.details.name}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{userData.details.name}</h1>
              <p className="text-gray-600">{userData.details.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* User Topics Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">My Topics</h2>
        {userData.topics.length === 0 ? (
          <p className="text-gray-500">No topics created yet</p>
        ) : (
          <div className="space-y-4">
            {userData.topics.map(topic => (
              <div key={topic.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">
                  {decodeHtml(topic.title?.rendered)}
                </h3>
                <div 
                  className="text-gray-600 mb-4"
                  dangerouslySetInnerHTML={{ __html: decodeHtml(topic.content?.rendered) }}
                />
                <div className="text-sm text-gray-500">
                  {new Date(topic.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Replies Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Replies</h2>
        {userData.replies.length === 0 ? (
          <p className="text-gray-500">No replies yet</p>
        ) : (
          <div className="space-y-4">
            {userData.replies.map(reply => (
              <div key={reply.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div 
                  className="text-gray-600 mb-4"
                  dangerouslySetInnerHTML={{ __html: decodeHtml(reply.content?.rendered) }}
                />
                <div className="text-sm text-gray-500">
                  {new Date(reply.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
