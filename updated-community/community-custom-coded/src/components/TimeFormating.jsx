import React from 'react';

const TimeFormating = ({ date }) => {
    const formatTimeDifference = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
      
        if (diffInSeconds < 60) {
          return 'just now';
        } else if (diffInSeconds < 3600) {
          const minutes = Math.floor(diffInSeconds / 60);
          return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
          const hours = Math.floor(diffInSeconds / 3600);
          return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 2592000) {
          const days = Math.floor(diffInSeconds / 86400);
          return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 31536000) {
          const months = Math.floor(diffInSeconds / 2592000);
          return `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
          const years = Math.floor(diffInSeconds / 31536000);
          return `${years} year${years > 1 ? 's' : ''} ago`;
        }
    };

    return (
        <span>{formatTimeDifference(new Date(date))}</span>
    );
};

export default TimeFormating;
