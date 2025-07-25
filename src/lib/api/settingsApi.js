// src/redux/api/settingApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const settingApi = createApi({
  reducerPath: "settingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api",
    prepareHeaders: (headers, { getState }) => {
      
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Setting"],
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => "/settings/me", 
      providesTags: ["Setting"],
    }),
    updateSettings: builder.mutation({
      query: (body) => ({
        url: "/settings/me",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Setting"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingApi;
