//
// FILE: The file where your authApi is defined (e.g., /store/api/authApi.js)
// ACTION: REPLACE with this full code.
//
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// This is the correct base URL for your API.
// It should be defined in your .env.local file as:
// NEXT_PUBLIC_API_URL=http://localhost:5000
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  console.error(
    "Environment variable NEXT_PUBLIC_API_URL is not set. Using fallback."
  );
}

export const authApi = createApi({
  reducerPath: "authApi",

  // --- CORRECTED baseQuery configuration ---
  baseQuery: fetchBaseQuery({
    // The baseUrl should ONLY be the root URL of your backend.
    // The "/api" part will now be part of each endpoint's URL.
    baseUrl: BASE_URL || "http://localhost:5000",

    // prepareHeaders belongs INSIDE fetchBaseQuery.
    // It runs before every request to add the auth token.
    prepareHeaders: (headers, { getState }) => {
      // Assuming you store your auth token in a slice named 'auth'
      const token = getState().auth?.token || localStorage.getItem("app_token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  // --- CORRECTED Endpoints ---
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (body) => ({
        url: "api/auth/register", // Added /api prefix
        method: "POST",
        body,
      }),
    }),

    // The query for "getMe" is now correct.
    getMe: builder.query({
      query: () => "/api/auth/me", // Added /api prefix
    }),

    // The URL for verifyOtp is now correct.
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/api/auth/verify-otp", // CORRECTED URL
        method: "POST",
        body: { email, otp },
      }),
    }),

    loginUser: builder.mutation({
      query: (body) => ({
        url: "/api/auth/login", // Added /api prefix
        method: "POST",
        body,
      }),
    }),

    requestPasswordReset: builder.mutation({
      query: (body) => ({
        url: "/api/auth/request-password-reset", // Added /api prefix
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/api/auth/reset-password", // Added /api prefix
        method: "POST",
        body,
      }),
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/api/auth/logout", // Added /api prefix
        method: "POST",
      }),
    }),
  }),
});

// This part was correct and remains the same.
export const {
  useRegisterUserMutation,
  useVerifyOtpMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetMeQuery,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi;
