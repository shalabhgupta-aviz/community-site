// src/store/api/wpApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const wpApi = createApi({
  reducerPath: 'wpApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      console.log('token', token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopics: builder.query({ query: () => '/topic' }),
    getReplies: builder.query({ query: (id) => `/reply?parent=${id}` }),
    getCurrentUser: builder.query({ query: () => '/users/me' }), // ✅ NEW
  }),
});



export const {
  useGetTopicsQuery,
  useGetRepliesQuery,
  useGetCurrentUserQuery, // ✅ NEW
} = wpApi;