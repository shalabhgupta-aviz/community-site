'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTopicDetails } from '@/lib/topics';
import { getQuestionsOfTopic } from '@/lib/questions';
import { getLatestRepliesInTopic } from '@/lib/replies'
import { decodeHtml } from '@/plugins/decodeHTMLentities';

export default function TopicPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [topic, setTopic] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [latestReply, setLatestReply] = useState(null);
    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const topicData = await getTopicDetails(id);
                const questionData = await getQuestionsOfTopic(id);
                const latestReplyData = await getLatestRepliesInTopic(id);
                console.log('Latest reply:', latestReplyData);
                setTopic(topicData);
                setQuestions(questionData);
                setLatestReply(latestReplyData);
            } catch (err) {
                setError('Failed to load topic');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchTopic();
        }
    }, [id]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!topic) return <div className="p-4">Topic not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">{decodeHtml(topic.title?.rendered)}</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <div
                    className="text-gray-600 mb-4"
                    dangerouslySetInnerHTML={{ __html: decodeHtml(topic.content?.rendered) }}
                />
                <div className="text-sm text-gray-500">
                    <span>{new Date(topic.date).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Questions under this Topic</h2>
                {questions.length === 0 ? (
                    <p className="text-gray-500">No questions yet</p>
                ) : (
                    questions.map((question, index) => (
                        <Link
                            key={question.id}
                            href={{
                                pathname: `/questions/${(question.title?.rendered).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`,
                                query: { id: question.id }
                            }}
                            className="block bg-white p-4 border rounded shadow-sm hover:border-gray-300"
                        >
                            <h3 className="font-medium">{decodeHtml(question.title?.rendered)}</h3>
                            {
                                question.id === latestReply[index].id && (
                                    <div className="mt-2 text-gray-400 italic">
                                        <span dangerouslySetInnerHTML={{ __html: decodeHtml(latestReply[index].latest_reply) }} />
                                    </div>
                                ) || (
                                    <div className="mt-2 text-gray-400 italic">
                                        No latest reply yet
                                    </div>
                                )
                            }
                            <div
                                className="text-gray-600 mt-2"
                                dangerouslySetInnerHTML={{ __html: decodeHtml(question.content?.rendered) }}
                            />
                            {question.latest_reply && (
                                <div className="mt-2 text-gray-400 italic">
                                    Latest reply: <span dangerouslySetInnerHTML={{ __html: decodeHtml(question.latest_reply) }} />
                                </div>
                            )}
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}