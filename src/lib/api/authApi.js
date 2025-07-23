import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    credentials: "include", // to send cookies for login
  }),

  prepareHeaders: (headers, { getState }) => {
      
      const token = getState().auth.token; 
      if (token) {
        
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
    
    credentials: "include", 
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    getMe: builder.query({
      query: () => "/auth/me",
    }),

    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify",
        method: "POST",
        body: { email, otp },
      }),
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    requestPasswordReset: builder.mutation({
      query: (body) => ({
        url: "/auth/request-password-reset",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useVerifyOtpMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetMeQuery,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi;
