'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getQuestionDetails } from '@/lib/questions';
import { getRepliesForQuestion, createReply } from '@/lib/replies';
import { getRecentTopics } from '@/lib/topics';
import { decodeHtml } from '@/plugins/decodeHTMLentities';
import { useSearchParams, usePathname } from 'next/navigation';
import SimpleRichTextEditor from '@/plugins/SimpleRichTextEditor';
import LoadingSpinner from '@/components/LoadingSpinner';
import Breadcrumb from '@/components/Breadcrumb';
import ReplyCardWithImage from '@/components/ReplyCardwithImage';
import './page.css';

export default function QuestionPage({ params }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const id = searchParams.get('id');
  const [question, setQuestion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [recentTopics, setRecentTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReplyLoading, setNewReplyLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionData = await getQuestionDetails(id);
        setQuestion(questionData);
        setReplies(questionData.latest_replies);
      } catch (err) {
        setError('Failed to load question');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentTopics = async () => {
      try {
        const topicsData = await getRecentTopics(5);
        setRecentTopics(topicsData);
      } catch (err) {
        console.error('Failed to load recent topics:', err);
      }
    };

    if (id) {
      fetchQuestion();
      fetchRecentTopics();
    }
  }, [id]);

  const loadMoreReplies = async () => {
    try {
      const newPage = page + 1;
      const newReplies = await getRepliesForQuestion(id);
      console.log('newReplies', newReplies);
      if (newReplies.length > 0) {
        setReplies(prev => [...prev, ...newReplies]);
        setPage(newPage);
      } else {
        setHasMoreReplies(false);
      }
    } catch (err) {
      console.error('Failed to load more replies:', err);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();

    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      setError('Authentication required. Please log in.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setNewReplyLoading(true);
    try {
      const result = await createReply(id, replyContent, token);
      const [replyObj] = result;
      setReplies(prev => [replyObj, ...prev]);
      setReplyContent('');
      setTimeout(() => {
        setNewReplyLoading(false);
      }, 500); // Simulate a delay for the animation
    } catch (err) {
      setError('Failed to submit reply');
      console.error(err);
      setNewReplyLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!question) {
    return <div className="p-4">Question not found</div>;
  }

  const paths = pathname.split('/').filter(Boolean);

  return (
    <div className="max-w-[80%] mx-auto p-4 mt-8">
      <Breadcrumb paths={paths} question={question} />

      <h1 className="text-4xl font-bold mb-6">{decodeHtml(question.title)}</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        {question.content && (
          <div
            className="text-gray-600 mb-4"
            dangerouslySetInnerHTML={{ __html: decodeHtml(question.content) }}
          />
        )}
        <div className="text-sm text-gray-500 flex justify-between items-center">
          <span>{new Date(question.date).toLocaleDateString()}</span>
          <span className="flex">
            <Link href={`/users/${question.author.username}`} className="flex items-center gap-2">
              <img 
                src={question.author.avatar} 
                alt={question.author.name} 
                className="w-6 h-6 rounded-full" 
              />
              <span className="display-inline">
                {question.author.name}
              </span>
            </Link>
          </span>
        </div>
      </div>

      <div className="flex space-x-6">
        <div className="w-[80%] space-y-4">
          <h2 className="text-xl font-semibold">Replies</h2>

          {replies.length === 0 ? (
            <p className="text-gray-500">No replies yet</p>
          ) : (
            <div className="reply-thread">
              {replies.map((reply, index) => (
                <div
                  key={index}
                  className={`transition-transform duration-500 ease-out ${
                    newReplyLoading && index === 0 ? 'transform scale-0' : 'transform scale-100'
                  }`}
                >
                  <ReplyCardWithImage 
                    reply={reply} 
                    index={index} 
                    totalReplies={replies.length} 
                  />
                </div>
              ))}
            </div>
          )}

          {hasMoreReplies && (
            <button
              onClick={loadMoreReplies}
              className="bg-blue-500 text-white px-4 py-2 rounded-full mt-4 font-bold hover:bg-blue-700"
            >
              Load More Replies
            </button>
          )}

          <div className="mb-8 mt-10 border-t border-gray-200 pt-5">
            <h3 className="text-xl font-semibold mb-4">
              Reply to: {decodeHtml(question.title)}
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-2 p-4 bg-white rounded-lg">
              <form onSubmit={handleSubmitReply}>
                <div className="editor-wrapper">
                  <SimpleRichTextEditor
                    onChange={(content) => {
                      setReplyContent(content);
                    }}
                    initialHtml={replyContent}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-[#191153] text-white px-4 py-2 rounded-full mt-4 font-bold ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2a1c7a]'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Reply'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="w-[30%]">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Recent Topics</h3>
            {recentTopics.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent topics</p>
            ) : (
              <ul className="space-y-3">
                {recentTopics.map((topic) => (
                  <li key={topic.id} className="pb-2 last:border-b-0 border-b border-gray-200">
                    <Link href={`/questions/${topic.slug}?id=${topic.id}`} className="hover:text-black text-sm font-bold">
                      {decodeHtml(topic.title)}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(topic.date).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
