import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
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
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => "/customers",
      providesTags: (result = []) => [
        ...result.map(({ _id }) => ({ type: "Customer", id: _id })),
        { type: "Customer", id: "LIST" },
      ],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, body }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Customer", id }],
    }),
  }),
});

export const { useGetCustomersQuery, useUpdateCustomerMutation } = customerApi;
