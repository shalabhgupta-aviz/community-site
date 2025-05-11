'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTopics } from '@/lib/topics';
import { decodeHtml } from '@/plugins/decodeHTMLentities';

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
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Topics</h1>

      {topics.length === 0 ? (
        <p className="text-gray-500">No topics yet</p>
      ) : (
        <div className="space-y-4">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={{
                pathname: `/topics/${(topic.title.rendered).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`,
                query: { id: topic.id } // ✅ Pass ID in URL query
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
          ))}
        </div>
      )}
    </div>
  );
}
