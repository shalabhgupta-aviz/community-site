// src/app/questions/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { decodeHtml } from '@/plugins/decodeHTMLentities';
import { getQuestions } from '@/lib/questions';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';
import { allSearch } from '@/lib/search';

const categories = [
  {
    name: 'SONiC',
    icon: '',
    description: 'Explore SONiC networking topics',
    href: '/sonic'
  },
  {
    name: 'AI Assistant',
    icon: '', 
    description: 'Discuss AI-powered networking',
    href: '/ai-assistant'
  },
  {
    name: 'Observability',
    icon: '',
    description: 'Network monitoring and insights',
    href: '/observability'
  }
];

const technologyPartners = [
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/broadcom.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/broadcom.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/broadcom.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/broadcom.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/broadcom.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/broadcom.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/broadcom.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/broadcom.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/broadcom.png',

  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/Cisco_logo_blue_2016.svg.png',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/Celestica_logo.svg-1024x331.png',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/1702072158490-1024x283.jpg',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/01_Keysight-1.webp',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/micas-networks-logo-1024x363.jpg',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/images.png',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/Wistron_logo.svg-1024x194.png'
]
const distriPartners = [
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/Carahsoft_Logo-1024x194.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/Carahsoft_Logo-1024x194.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/Carahsoft_Logo-1024x194.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/Carahsoft_Logo-1024x194.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/Carahsoft_Logo-1024x194.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/Carahsoft_Logo-1024x194.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/Carahsoft_Logo-1024x194.png',
  'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/Carahsoft_Logo-1024x194.png',

  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/download-1.jpeg',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/images.jpeg',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/Hardware_Nation_Logo_2025_FINAL.svg',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/micas-networks-logo-1024x363.jpg',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/download-4.webp',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/download-5.webp',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/images-1-e1734534834559.jpeg',
  // 'https://dev.community.aviznetworks.com/wp-content/uploads/2025/04/download-6.webp'
]


export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const qs = await getQuestions(page, 10);    
        console.log("qs", qs);                          
        setQuestions(prev => page === 1 ? qs : [...prev, ...qs]);
        setHasMore(qs.length === 10); // If we get less than 10 items, we've reached the end
      } catch (err) {
        console.error(err);
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm) {
        setIsLoading(true);
        try {
          const results = await allSearch(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) return (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="bg-[#191153] flex flex-col items-center">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-[url('https://dev.community.aviznetworks.com/wp-content/uploads/2025/03/06-Artboard-13.png')] bg-contain bg-no-repeat bg-top text-white pt-2 pb-16 h-[60vh]"
      >
        {/* Background dots or pattern */}
        <div className="absolute inset-0"></div>
        <div className="relative max-w-5xl mx-auto px-4 text-center pt-30">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-8xl font-extrabold mb-4"
          >
            Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg mb-8"
          >
            Browse and search through community questions and discussions. Find answers, share knowledge, and engage with other members.
          </motion.p>

          {/* Category Links */}
          <div className="inline-flex mt-8 gap-4">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Link
                  href={cat.href}
                  className="px-6 py-2 rounded-lg bg-[#4a3399] text-white font-medium hover:bg-[#5a3dd4] flex items-center gap-2"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="max-w-5xl border-5 border-[#6E4BEB] flex items-center bg-white rounded-full shadow-md overflow-hidden p-5"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions and replies..."
                className="flex-grow px-6 py-3 text-black focus:outline-none"
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
            </motion.div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden z-50 h-100 overflow-y-auto"
                >
                  {searchResults.map((result, index) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      className="block p-4 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <h3 className="font-medium text-gray-900">{result.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{result.excerpt}</p>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      <div className="flex gap-8 max-w-7xl mx-auto p-4 pt-10 mb-20">
        {/* Left Sidebar - 20% */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-[20%]"
        >
          {/* Technology Partners */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Technology Partners</h2>
            <div className="flex flex-col gap-4">
              {technologyPartners.map((src, index) => (
                <motion.div 
                  key={`${src}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg flex items-center justify-center border border-gray-200"
                >
                  <Image
                    src={src}
                    alt="Partner logo"
                    width={120}
                    height={60}
                    className="object-contain" 
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Distributors */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Aviz VARs and Distributors</h2>
            <div className="flex flex-col gap-4">
              {distriPartners.map((src, index) => (
                <motion.div 
                  key={`${src}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="p-4 bg-white rounded-lg flex items-center justify-center border border-gray-200"
                >
                  <Image
                    src={src}
                    alt="Distributor logo"
                    width={120}
                    height={60}
                    className="object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content - Questions List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-white rounded-[10px] shadow-lg p-6"
        >
          {questions.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500"
            >
              No questions yet
            </motion.p>
          ) : (
            <div className="space-y-4">
              {questions.map((q, index) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Link
                    href={{
                      pathname: `/questions/${q.title.rendered
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '')}`,
                      query: { id: q.id }
                    }}
                    className="block bg-white p-6 rounded-lg shadow-sm border hover:border-gray-300"
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      {decodeHtml(q.title.rendered)}
                    </h2>
                    <p
                      className="text-gray-600 mb-4 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: decodeHtml(q.content.rendered) }}
                    />
                    <div className="text-sm text-gray-500">
                      <span>By {q.bbp_extra?.author?.name || 'Anonymous'}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(q.date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{q.bbp_extra?.reply_count || 0} {q.bbp_extra?.reply_count === 1 ? 'reply' : 'replies'}</span>
                    </div>
                    {q.bbp_extra?.last_reply_content && (
                      <div className="mt-2 text-gray-400 italic line-clamp-1">
                        Latest: <span dangerouslySetInnerHTML={{ __html: decodeHtml(q.bbp_extra.last_reply_content) }} />
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}

              {hasMore && !loading && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={loadMore}
                  className="w-full p-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
                >
                  Load more questions
                </motion.button>
              )}

              {loading && page > 1 && (
                <div className="flex justify-center p-4">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}