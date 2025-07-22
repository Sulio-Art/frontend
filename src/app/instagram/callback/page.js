// src/app/instagram/callback/page.js
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function InstagramCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('Connecting your Instagram account...');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    console.log("FRONTEND (Callback Page): Page loaded. Checking for code or error in URL.");

    if (error) {
      const errorDescription = searchParams.get('error_description');
      console.error("FRONTEND (Callback Page): Instagram returned an error:", errorDescription);
      setMessage(`Error: ${errorDescription}`);
      // Optionally redirect to an error page
      // router.push('/error-page');
      return;
    }

    if (code) {
      console.log("FRONTEND (Callback Page): Found authorization code:", code);
      console.log("FRONTEND (Callback Page): Sending this code to our backend API.");

      // This is where you send the code to your Node.js backend
      sendCodeToBackend(code);
    }
  }, [searchParams, router]);

  const sendCodeToBackend = async (code) => {
    try {
      // IMPORTANT: You must send your app's own authentication token (e.g., a JWT)
      // so the backend knows WHICH user is connecting their Instagram account.
      const authToken = localStorage.getItem('myAppAuthToken'); // Example

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/instagram/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Sending your app's token
        },
        body: JSON.stringify({ code }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Backend failed to process the code.');
      }
      
      console.log("FRONTEND (Callback Page): Backend successfully processed the code. Response:", data);
      setMessage('Successfully connected! Redirecting to dashboard...');

      // Redirect to the dashboard after successful connection
      router.push('/dashboard');

    } catch (err) {
      console.error("FRONTEND (Callback Page): Error sending code to backend:", err);
      setMessage(`Failed to connect account: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>{message}</h1>
      {/* You can add a spinner component here */}
    </div>
  );
}