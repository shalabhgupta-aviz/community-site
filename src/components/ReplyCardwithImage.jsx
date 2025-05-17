
import { decodeHtml } from '@/plugins/decodeHTMLentities';
import React from 'react';
import { motion } from 'framer-motion';
import TimeDifferenceFormat from '@/components/TimeDifferenceFormat';

const ReplyCardWithImage = ({ reply, index, totalReplies }) => {

  return (
    <motion.div 
      key={reply.id} 
      className="flex mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="reply-avatar-container mr-4">
        <img 
          src={reply.author?.avatar || "https://via.placeholder.com/40"} 
          alt={reply.author?.name || "User"} 
          className="w-10 h-10 rounded-full"
        />
        {index !== totalReplies - 1 && (
          <div className="thread-line h-full w-0.5 bg-gray-300 mx-auto mt-2"></div>
        )}
      </div>
      <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
        <div className="font-bold text-black mb-1 text-md">
          {reply.author?.name || "Anonymous User"}
        </div>
        <div
          className="text-gray-600 mb-3"
          dangerouslySetInnerHTML={{ __html: decodeHtml(reply.content?.rendered) }}
        />
        <div className="text-xs text-gray-500">
          <TimeDifferenceFormat date={reply.date} />
        </div>
        {reply.image && (
          <div className="mt-3">
            <img 
              src={reply.image} 
              alt="Reply related" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReplyCardWithImage;
