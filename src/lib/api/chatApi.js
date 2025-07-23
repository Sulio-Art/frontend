

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (body) => ({
        
        url: '/chat/chat',
        method: 'POST',
        body, 
      }),
    }),
    
  }),
});

export const {
  useSendMessageMutation,
} = chatApi;