// src/components/ConnectInstagramButton.js
"use client";

import React from "react";

const ConnectInstagramButton = () => {
  const handleConnect = () => {
    console.log("FRONTEND: 'Connect' button clicked.");

    const scopes = [
      "instagram_business_basic",
      "instagram_business_content_publish",
      "instagram_business_manage_messages",
      "instagram_business_manage_comments",
    ];

    const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
    const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI;

    const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes.join(",")}`;

    console.log("FRONTEND: Redirecting user to Instagram auth URL:", authUrl);
    window.location.href = authUrl;
  };

  return <button onClick={handleConnect}>Connect Instagram Account</button>;
};

export default ConnectInstagramButton;
