// src/redux/api/artworkApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const artworkApi = createApi({
  reducerPath: "artworkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Artwork"],
  endpoints: (builder) => ({
    getAllArtworks: builder.query({
      query: () => "/artworks",
      providesTags: ["Artwork"],
    }),
    createArtwork: builder.mutation({
      query: (formData) => ({
        url: "/artworks",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Artwork"],
    }),
    deleteArtwork: builder.mutation({
      query: (id) => ({
        url: `/artworks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Artwork"],
    }),
  }),
});

export const {
  useGetAllArtworksQuery,
  useCreateArtworkMutation,
  useDeleteArtworkMutation,
} = artworkApi;
