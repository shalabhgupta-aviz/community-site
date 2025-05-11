// src/store/api/wpApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const wpApi = createApi({
  reducerPath: 'wpApi', // This key will appear in your Redux store

  

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL, // ✅ wp/v2 endpoint
    prepareHeaders: (headers) => {
      const token = Cookies.get('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),

  tagTypes: ['Topics', 'Replies', 'User'], // optional: useful for caching & invalidation

  endpoints: (builder) => ({
    // ✅ Get all topics
    getTopics: builder.query({
      query: () => '/topic',
      providesTags: ['Topics'],
    }),

    // ✅ Get replies by topic/question ID
    getReplies: builder.query({
      query: (id) => `/reply?parent=${id}`,
      providesTags: (result, error, id) => [{ type: 'Replies', id }],
    }),

    // ✅ Get logged-in user details
    getCurrentUser: builder.query({
      query: () => '/users/me?context=edit',
      providesTags: ['User'],
    }),
  }),
});

// Export RTK Query auto-generated hooks
export const {
  useGetTopicsQuery,
  useGetRepliesQuery,
  useGetCurrentUserQuery,
} = wpApi;