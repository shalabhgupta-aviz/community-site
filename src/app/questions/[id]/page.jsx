'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getQuestionDetails } from '@/lib/questions';
import { getRepliesForQuestion, createReply } from '@/lib/replies';
import { decodeHtml } from '@/plugins/decodeHTMLentities';
import { useSearchParams } from 'next/navigation';
import RichTextEditor from '@/plugins/richTextEditor';
import './page.css';

export default function QuestionPage({ params }) {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [question, setQuestion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionData = await getQuestionDetails(id);
        const repliesData = await getRepliesForQuestion(id);
        setQuestion(questionData);
        setReplies(repliesData);
      } catch (err) {
        setError('Failed to load question');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id]);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const newReply = await createReply(id, replyContent, token);
      setReplies([...replies, newReply]);
      setReplyContent('');
      setIsAccordionOpen(false);
    } catch (err) {
      console.error('Failed to submit reply:', err);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!question) {
    return <div className="p-4">Question not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{decodeHtml(question.title?.rendered)}</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        {question.content?.rendered ? (
          <div 
            className="text-gray-600 mb-4"
            dangerouslySetInnerHTML={{ __html: decodeHtml(question.content.rendered) }}
          />
        ) : (
          <div className="text-gray-200 mb-4 italic">
            No description available
          </div>
        )}
        <div className="text-sm text-gray-500">
          <span>Status: {question.status}</span>
          <span className="mx-2">•</span>
          <span>Type: {question.type}</span>
          <span className="mx-2">•</span>
          <span>{new Date(question.date).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Replies</h2>

        <div className="mb-4">
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full bg-blue-500 text-white p-4 rounded-lg font-semibold flex justify-between items-center accordion-title"
          >
            <span>Reply to: {decodeHtml(question.title?.rendered)}</span>
            <span className={`transform transition-transform duration-1000 ${isAccordionOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isAccordionOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}` }>
            <form onSubmit={handleSubmitReply} className="mt-2 p-4 bg-white rounded-lg border">
              <RichTextEditor />
              <button 
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
              >
                Submit Reply
              </button>
            </form>
          </div>
        </div>

        {replies.length === 0 ? (
          <p className="text-gray-500">No replies yet</p>
        ) : (
          replies.map((reply) => (
            <div key={reply.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div
                className="text-gray-600 mb-4"
                dangerouslySetInnerHTML={{ __html: decodeHtml(reply.content?.rendered) }}
              />
              <div className="text-sm text-gray-500">
                {/* <span>Reply #{reply.menu_order}</span> */}
                {/* <span className="mx-2">•</span> */}
                <span>{new Date(reply.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
