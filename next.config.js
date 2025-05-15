/** @type {import('next').NextConfig} */
const nextConfig = {
    // …any existing config…
    images: {
      domains: [
        'lh3.googleusercontent.com',
        // add any others you need, e.g.:
        'secure.gravatar.com',
        'dev.community.aviznetworks.com'
      ]
    }
  }
  
  module.exports = nextConfig