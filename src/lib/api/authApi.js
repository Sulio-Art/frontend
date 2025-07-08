import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api',
    credentials: 'include', // to send cookies for login
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: '/auth/verify',
        method: 'POST',
        body: { email, otp },
      }),
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useVerifyOtpMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = authApi;
