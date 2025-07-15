// src/components/layout/CurrentUser.js

"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "@/lib/api/authApi";
import { setCredentials } from "@/lib/slices/authSlice";

export function CurrentUser() {
  const dispatch = useDispatch();

  // This query will run automatically when the component mounts
  const { data, isSuccess } = useGetMeQuery();

  useEffect(() => {
    // When the query successfully returns a user, dispatch it to the store
    if (isSuccess && data) {
      // We wrap it in the structure that setCredentials expects
      dispatch(setCredentials({ user: data.user,
        token: "hydrated_from_cokkie" 
       })); // token can be a placeholder
    }
  }, [isSuccess, data, dispatch]);

  // This component doesn't render anything itself
  return null;
}
