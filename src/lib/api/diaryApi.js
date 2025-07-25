

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const diaryApi = createApi({
  reducerPath: 'diaryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api',
   
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['DiaryEntry'],
  endpoints: (builder) => ({
   
    getMyDiaryEntries: builder.query({
      query: () => '/diary',
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: 'DiaryEntry', id: _id })),
        { type: 'DiaryEntry', id: 'LIST' },
      ],
    }),
    
    createDiaryEntry: builder.mutation({
      query: (body) => ({
        url: '/diary',
        method: 'POST',
        body,
      }),
      
      invalidatesTags: [{ type: 'DiaryEntry', id: 'LIST' }],
    }),
    
    deleteDiaryEntry: builder.mutation({
      query: (id) => ({
        url: `/diary/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'DiaryEntry', id: 'LIST' }],
    }),
    
  }),
});

export const {
  useGetMyDiaryEntriesQuery,
  useCreateDiaryEntryMutation,
  useDeleteDiaryEntryMutation,
} = diaryApi;