"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ConnectPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("app_token");
    if (!token) router.replace("/auth/login");
  }, [router]);

  const handleConnectInstagram = () => {
    const scopes =
      "instagram_business_basic,instagram_business_content_publish";
    const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
    const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI;
    const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">One Last Step!</h1>
        <p className="text-gray-600 mb-6">
          Connect your Instagram account to unlock all features.
        </p>
        <Button onClick={handleConnectInstagram} className="w-full">
          Connect Instagram Account
        </Button>
        <Button
          variant="link"
          onClick={() => router.push("/dashboard")}
          className="mt-4"
        >
          Skip for now
        </Button>
      </Card>
    </div>
  );
}
