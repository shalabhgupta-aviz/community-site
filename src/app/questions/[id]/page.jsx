
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

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    // if (!replyContent || replyContent.trim() === '') {
    //   setError('Reply content cannot be empty');
    //   return;
    // }

    // setIsSubmitting(true);
    // setError(null);

    console.log('replyContent', replyContent);

    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    if (!token) {
      setError('Authentication required. Please log in.');
      setIsSubmitting(false);
      return;
    }

    // try {
    //   const newReply = await createReply(id, replyContent, token);
      
    //   if (newReply) {
    //     // Refresh the question and replies
    //     const updatedQuestion = await getQuestionDetails(id);
    //     setQuestion(updatedQuestion);
    //     setReplies(updatedQuestion.latest_replies);
    //     setReplyContent('');
    //   }
    // } catch (err) {
    //   console.error('Failed to submit reply:', err);
    //   setError('Failed to submit reply. Please try again.');
    // } finally {
    //   setIsSubmitting(false);
    // }
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
      {/* Breadcrumb navigation */}
      <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
          </li>
          {paths.map((path, index) => {
            const href = index === paths.length - 1 
              ? '#' 
              : `/${paths.slice(0, index + 1).join('/')}`;
            
            const displayPath = path === '[id]' && question 
              ? decodeHtml(question.title?.rendered) 
              : path.charAt(0).toUpperCase() + path.slice(1);
            
            return (
              <li key={index}>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  {index === paths.length - 1 ? (
                    <span className="text-blue-600">{displayPath}</span>
                  ) : (
                    <Link href={href} className="text-gray-600 hover:text-blue-600">
                      {displayPath}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      <h1 className="text-4xl font-bold mb-6">{decodeHtml(question.title?.rendered)}</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        {question.content?.rendered && (
          <div
            className="text-gray-600 mb-4"
            dangerouslySetInnerHTML={{ __html: decodeHtml(question.content.rendered) }}
          />
        )}
        <div className="text-sm text-gray-500 flex justify-between items-center">
          <span>{new Date(question.date).toLocaleDateString()}</span>
          <span className="flex">
            <Link href={`/users/${question.bbp_extra.author.username}`} className="flex items-center gap-2">
              <img 
                src={question.bbp_extra.author.avatar} 
                alt={question.bbp_extra.author.name} 
                className="w-6 h-6 rounded-full" 
              />
              <span className="display-inline">
                {question.bbp_extra.author.name}
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
                <div key={reply.id} className="flex mb-4">
                  <div className="reply-avatar-container mr-4">
                    <img 
                      src={reply.author?.avatar || "https://via.placeholder.com/40"} 
                      alt={reply.author?.name || "User"} 
                      className="w-10 h-10 rounded-full"
                    />
                    {index !== replies.length - 1 && (
                      <div className="thread-line h-full w-0.5 bg-gray-300 mx-auto mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
                    <div className="font-medium text-gray-800 mb-1">
                      {reply.author?.name || "Anonymous User"}
                    </div>
                    <div
                      className="text-gray-600 mb-3"
                      dangerouslySetInnerHTML={{ __html: decodeHtml(reply.content?.rendered) }}
                    />
                    <div className="text-xs text-gray-500">
                      {new Date(reply.date).toLocaleDateString()} at {new Date(reply.date).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Reply to: {decodeHtml(question.title?.rendered)}
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
                      console.log('Editor content updated:', content);
                      setReplyContent(content);
                    }}
                    initialHtml={replyContent}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Reply'}
                </button>
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
                  <li key={topic.id} className="pb-2 last:border-b-0">
                    <Link href={`/questions?id=${topic.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      {decodeHtml(topic.title?.rendered || topic.title)}
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
