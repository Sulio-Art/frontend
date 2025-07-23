

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const eventApi = createApi({
  reducerPath: 'eventApi',
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
  tagTypes: ['Event'],
  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: () => '/events',
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: 'Event', id: _id })),
        { type: 'Event', id: 'LIST' },
      ],
    }),
    createEvent: builder.mutation({
      query: (body) => ({
        url: '/events',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),
    
  }),
});

export const {
  useGetAllEventsQuery,
  useCreateEventMutation,
  useDeleteEventMutation,
} = eventApi;