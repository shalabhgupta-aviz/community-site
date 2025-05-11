'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getQuestions } from '@/lib/auth';
import { decodeHtml } from '@/plugins/decodeHTMLentities';
import { useSearchParams } from 'next/navigation';

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // const questionsData = await getQuestions();
        // console.log("questionsData", questionsData);
        // setQuestions(questionsData);
      } catch (err) {
        setError('Failed to load questions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Questions</h1>

      {questions.length === 0 ? (
        <p className="text-gray-500">No questions yet</p>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Link
              key={question.id}
              href={{
                pathname: `/questions/${(question.title.rendered).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`,
                query: { id: question.id }
              }}
              className="block bg-white p-6 rounded-lg shadow-sm border hover:border-gray-300"
            >
              <h2 className="text-xl font-semibold mb-2">{decodeHtml(question.title.rendered)}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: decodeHtml(question.content.rendered) }} />
              <div className="text-sm text-gray-500">
                <span>By {question.author}</span>
                <span className="mx-2">•</span>
                <span>{new Date(question.date).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
