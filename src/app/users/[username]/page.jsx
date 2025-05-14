'use client'
import { use, useState, useEffect } from 'react'
import { getUserByUsername } from '@/lib/users'
import Link from 'next/link'

export default function UserProfile({ params }) {
  const { username } = use(params)

  const [user, setUser]               = useState(null)
  const [topics, setTopics]           = useState([])
  const [replies, setReplies]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [topicPage, setTopicPage]     = useState(1)
  const [replyPage, setReplyPage]     = useState(1)
  const [topicTotalPages, setTopicTotalPages] = useState(1)
  const [replyTotalPages, setReplyTotalPages] = useState(1)
  const [activeTab, setActiveTab]     = useState('topics')

  // 1) initial load of page 1 /users
  useEffect(() => {
    setLoading(true)
    getUserByUsername(username, 1, 1)
      .then(u => {
        if (!u) throw Error()
        setUser(u)
        setTopics(u.latest_topics.items)
        setReplies(u.latest_replies.items)
        setTopicTotalPages(u.latest_topics.total_pages)
        setReplyTotalPages(u.latest_replies.total_pages)
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [username])

  // 2) load more topics
  useEffect(() => {
    if (topicPage === 1) return
    getUserByUsername(username, topicPage, 1)
      .then(u => {
        setTopics(prev => [...prev, ...u.latest_topics.items])
        setTopicTotalPages(u.latest_topics.total_pages)
      })
      .catch(() => {/* ignore */})
  }, [topicPage, username])

  // 3) load more replies
  useEffect(() => {
    if (replyPage === 1) return
    getUserByUsername(username, 1, replyPage)
      .then(u => {
        setReplies(prev => [...prev, ...u.latest_replies.items])
        setReplyTotalPages(u.latest_replies.total_pages)
      })
      .catch(() => {/* ignore */})
  }, [replyPage, username])

  if (loading) return <p>Loading…</p>
  if (error)   return <p className="text-red-500">{error}</p>
  if (!user)   return <p>User not found</p>

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          {user.description && (
            <p className="text-gray-600">{user.description}</p>
          )}
          {user.url && (
            <a
              href={user.url}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.url}
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab('topics')}
          className={`py-2 px-4 ${
            activeTab === 'topics'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
          }`}
        >
          Latest Topics
        </button>
        <button
          onClick={() => setActiveTab('replies')}
          className={`py-2 px-4 ${
            activeTab === 'replies'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500'
          }`}
        >
          Latest Replies
        </button>
      </div>

      {/* Topics */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          {topics.length > 0 ? (
            <>
              {topics.map(topic => (
                <Link
                  key={topic.id}
                  href={`/questions/${topic.id}`}
                  className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                >
                  <h3 className="font-medium">{topic.title.rendered}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(topic.date).toLocaleDateString()}
                  </span>
                </Link>
              ))}
              {topicPage < topicTotalPages && (
                <button
                  onClick={() => setTopicPage(prev => prev + 1)}
                  className="w-full p-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
                >
                  Load more topics
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-500">No topics yet</p>
          )}
        </div>
      )}

      {/* Replies */}
      {activeTab === 'replies' && (
        <div className="space-y-4">
          {replies.length > 0 ? (
            <>
              {replies.map(reply => (
                <div
                  key={reply.id}
                  className="p-4 bg-white rounded-lg shadow"
                >
                  <h4 className="font-bold mb-2">
                    Replied to: {reply.topic_title}
                  </h4>
                  <div
                    className="prose max-w-none mb-2"
                    dangerouslySetInnerHTML={{
                      __html: `${reply.content.substring(
                        0,
                        200
                      )}…`,
                    }}
                  />
                  <div className="text-sm text-gray-500">
                    <Link
                      href={reply.link}
                      className="hover:underline"
                    >
                      {new Date(reply.date).toLocaleDateString()}
                    </Link>
                  </div>
                </div>
              ))}
              {replyPage < replyTotalPages && (
                <button
                  onClick={() => setReplyPage(prev => prev + 1)}
                  className="w-full p-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
                >
                  Load more replies
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-500">No replies yet</p>
          )}
        </div>
      )}
    </div>
  )
}