// src/redux/api/profileApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL ,
    prepareHeaders: (headers, { getState }) => {
      
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => "/profiles/me",
      providesTags: ["Profile"],
    }),
    updateMyProfile: builder.mutation({
      query: (formData) => ({
        url: "/profiles/me",
        method: "POST", 
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useGetMyProfileQuery, useUpdateMyProfileMutation } = profileApi;
