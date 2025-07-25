
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export default function ConnectInstagramButton() {
  const { status } = useSession();
  const router = useRouter();

  const handleConnect = () => {
    
    const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI;
    const scope =
      "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish";

    const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

    
    window.location.href = instagramAuthUrl;
  };

  
  return (
    <Button
      onClick={handleConnect}
      disabled={status !== "authenticated"}
      size="lg"
      className="mt-4"
    >
      Connect Your Instagram Account
    </Button>
  );
}
