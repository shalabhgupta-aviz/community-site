'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getTopics } from '../../lib/topics';

export default function CreateQuestionPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchTopicsAndTags = async () => {
      try {
        const [topicsData, tagsData] = await Promise.all([
          getTopics(),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`).then(res => res.json())
        ]);
        
        setTopics(topicsData);
        setTags(tagsData);
        
        
        if (topicsData.length > 0) {
          setSelectedTopic(topicsData[0].id.toString());
        }
      } catch (err) {
        setError('Failed to load topics and tags');
        console.error(err);
        toast.error('Failed to load topics and tags');
      }
    };

    fetchTopicsAndTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !selectedTopic) {
      toast.error('Please fill in all fields and select a topic');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/wp-json/wp/v2/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          status: 'publish',
          topic: selectedTopic,
          tags: selectedTags
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      toast.success('Question created successfully');
      router.push('/questions');
      
    } catch (error) {
      console.error('Error creating question:', error);
      toast.error('Failed to create question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTags(value);
  };

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-3xl mx-auto p-6"
      >
        <h1 className="text-3xl font-bold mb-8">Create a New Question</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Question Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your question title"
                required
              />
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                Select Topic
              </label>
              <select
                id="topic"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Choose a topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.title.rendered}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Select Tags
            </label>
            <select
              id="tags"
              multiple
              value={selectedTags}
              onChange={handleTagChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500"
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple tags</p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Question Details
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Describe your question in detail..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating...' : 'Create Question'}
            </button>
          </div>
        </form>
      </motion.div>
    </ProtectedRoute>
  );
}
