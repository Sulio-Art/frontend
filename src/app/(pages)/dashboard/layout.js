

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "@/lib/api/authApi";
import { setUser, clearUser } from "@/lib/slices/authSlice";
import Sidebar from "@/components/Dashboard/Sidebar";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();

  
  const { hasChecked, user } = useSelector((state) => state.auth);

 
  const { data, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: hasChecked,
  });

  useEffect(() => {
   
    if (isSuccess && data) {
     
      const token = localStorage.getItem("app_token");
      dispatch(setUser({ user: data.user, token }));
    } else if (isError) {
     
      dispatch(clearUser());
      router.replace("/auth/login?error=session_expired");
    }
  }, [isSuccess, isError, data, dispatch, router]);

  
  if (!hasChecked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  
  if (!user) {
    router.replace("/auth/login");
    return null;
  }

  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <Toaster position="top-center" />
        {children}
      </main>
    </div>
  );
}
