"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function InstagramCallback() {
  const [status, setStatus] = useState(
    "Connecting your Instagram account, please wait..."
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setStatus(
        `Error: ${searchParams.get("error_description") || "User denied access."}`
      );
      return;
    }

    if (code) {
      const token = localStorage.getItem("app_token");
      if (!token) {
        setStatus("Authentication error. Please log in again.");
        setTimeout(() => router.replace("/auth/login"), 3000);
        return;
      }

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/instagram/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Backend failed to connect account.");
          return res.json();
        })
        .then(() => {
          setStatus("Successfully connected! Redirecting to your dashboard...");
          setTimeout(() => router.replace("/dashboard"), 2000);
        })
        .catch((err) => setStatus(`Failed to connect: ${err.message}`));
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <p className="text-lg text-gray-700">{status}</p>
    </div>
  );
}
