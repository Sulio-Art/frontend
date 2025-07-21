// src/app/not-found.js

"use client";

import Link from "next/link";
import { useSelector } from "react-redux"; // Import the hook to check state
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  
  const { token } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;

  const destination = isLoggedIn ? "/dashboard" : "/";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 max-w-md w-full mx-4">
        <Globe className="h-16 w-16 text-purple-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you were looking for. It might have
          been moved or deleted.
        </p>
      
        <Link href={destination}>
          <Button className="bg-purple-600 hover:bg-purple-700">
            {isLoggedIn ? "Return to Dashboard" : "Return to Homepage"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
