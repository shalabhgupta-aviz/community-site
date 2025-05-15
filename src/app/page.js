'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import '../../styles/globals.css'
import { allSearch } from '@/lib/search'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// Replace these with your actual logo paths
const categories = ['SONiC', 'AI Assistant', 'Observability']
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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const searchTopicsAndReplies = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([])
        return
      }

      setIsLoading(true)
      try {
        const data = await allSearch(searchTerm)
        console.log(data)
        setSearchResults(data)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchTopicsAndReplies, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([])
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="bg-[#191153] flex flex-col items-center">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-[var(--primary)] text-white pt-10 pb-16"
      >
        {/* Background dots or pattern */}
        <div className="absolute inset-0 bg-[url('https://dev.community.aviznetworks.com/wp-content/uploads/2025/03/06-Artboard-13.png')] bg-contain bg-no-repeat bg-top"></div>
        <div className="relative max-w-5xl mx-auto px-4 text-center pt-30">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-8xl font-extrabold mb-4"
          >
            Aviz Community
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg mb-8"
          >
            A global hub for network innovators exploring SONiC, Network Observability,
            and AI-powered networking assistants. Join engineers, architects, and
            decision-makers solving real challenges across enterprise, data centers
            and telco networks. No noise. Just outcomes. Welcome to the home of serious
            network transformation.
          </motion.p>
          {/* Category Links */}
          <div className="inline-flex mt-8">
            {categories.map((cat, index) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className='mb-2'
              >
                <Link
                  href={`/questions?category=${cat.toLowerCase()}`}
                  className="rounded-t-lg mr-5 ml-5 bg-[#6E4BEB] text-white font-medium transition hover:bg-white hover:text-[#6E4BEB] p-4"
                >
                  {cat}
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
                placeholder="Search topics and replies..."
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
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        href={{
                          pathname: result.type === 'topic' 
                            ? `/questions/${result.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`
                            : `/questions/${result.topic_slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`,
                          query: { id: result.type === 'topic' ? result.id : result.topic_id }
                        }}
                        className="block p-4 border-b hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium px-2 py-1 rounded bg-[#6E4BEB] text-white">
                            {result.type === 'topic' ? 'Topic' : 'Reply'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(result.date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="text-900 text-black text-left font-semibold">
                          {result.type === 'topic' ? result.title : `Re: ${result.topic_slug}`}
                        </h3>
                        
                        {result.type === 'reply' && result.content && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2 text-left">{result.content}</p>
                        )}
                        {result.type === 'topic' && result.excerpt && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2 text-left">{result.excerpt}</p>
                        )}
                        
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <span>{result.type === 'topic' ? `Topic #${result.id}` : `Reply to Topic #${result.topic_id}`}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='max-w-[80%] bg-white rounded-[20px] shadow-lg mt-20 mb-20 p-20'
      >

      {/* Technology Partners */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto rounded-[20px]"
      >
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl font-semibold text-center mb-8 font-bold"
        >
          Technology Partners
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center">
          {technologyPartners.map((src, index) => (
            <motion.div 
              key={`${src}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-4 bg-white rounded-lg flex items-center justify-center border-1 border-solid border-gray-200 hover:shadow-lg transition-shadow"
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
      </motion.section>

      {/* Distributors */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-7xl mx-auto rounded-[20px] mt-20"
      >
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-2xl font-semibold text-center mb-8 font-bold"
        >
          Aviz VARs and Distributors
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center">
          {distriPartners.map((src, index) => (
            <motion.div 
              key={`${src}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              className="p-4 bg-white rounded-lg flex items-center justify-center border-1 border-solid border-gray-200 hover:shadow-lg transition-shadow"
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
      </motion.section>
      </motion.div>

      {/* Subscribe Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-black text-white w-[80%] p-10 rounded-[20px] shadow-lg mb-20"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-2xl font-semibold"
          >
            Subscribe to Aviz latest updates
          </motion.h3>
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[#191153] hover:bg-[#2a1c7a] rounded-full font-medium"
          >
            Join
          </motion.button>
        </div>
      </motion.section>
    </div>
  )
}
