
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();

  
  const [authStatus, setAuthStatus] = useState("loading"); 
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
   
    const token = localStorage.getItem("app_token");

    if (!token) {
      
      console.error(
        "Dashboard Access Denied: No app_token found in localStorage."
      );
      router.replace("/auth/login");
      return; 
    }

    
    setAuthStatus("authenticated");

    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/instagram/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch Instagram profile");
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data); 
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      });

    
  }, [router]);

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
      </div>
    );
  }

 
  if (authStatus === "authenticated") {
    return (
      <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Your Dashboard
        </h1>

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Instagram Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="text-red-500 font-medium">Error: {error}.</p>
            )}

            {profile ? (
              <div className="flex items-center space-x-4">
                {profile.profile_picture_url && (
                  <Image
                    src={profile.profile_picture_url}
                    alt="Instagram Profile Picture"
                    className="w-20 h-20 rounded-full border-2 border-purple-200"
                    width={80}
                    height={80}
                    unoptimized={true}
                  />
                )}
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    @{profile.username}
                  </p>
                  <p className="text-gray-600">
                    <strong>{profile.followers_count}</strong> Followers
                  </p>
                </div>
              </div>
            ) : (
              
              !error && (
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              )
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  
  return null;
}
