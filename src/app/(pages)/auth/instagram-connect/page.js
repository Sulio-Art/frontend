
"use client";


import { useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function InstagramConnectComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
 
  const hasFired = useRef(false);

  useEffect(() => {
    
    if (hasFired.current) {
      return;
    }
    
    hasFired.current = true;

    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const appToken = searchParams.get('state');

    const connectAndLogin = async () => {
      try {
        if (error) {
          throw new Error('Instagram connection was denied by the user.');
        }
        if (!appToken) {
          throw new Error('Authentication state token is missing. Please try again.');
        }
        if (!code) {
          throw new Error('Instagram authorization code is missing. Please try again.');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/instagram/connect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${appToken}`
          },
          body: JSON.stringify({ code: code.replace('#_', '') }),
        });

        if (!response.ok) {
          
          const errData = await response.json(); 
          throw new Error(errData.message || 'An unknown error occurred on the backend.');
        }

        const data = await response.json();
        
        
        localStorage.setItem('app_token', data.token); 
        
        
        router.replace('/dashboard?success=instagram_connected');

      } catch (err) {
        console.error("Final connection step failed:", err.message);
        
        router.replace(`/auth/login?error=${encodeURIComponent(err.message)}`);
      }
    };

    connectAndLogin();
    
 
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-16 w-16 animate-spin text-purple-600 mb-4" />
        <p className="text-lg text-gray-700">Finalizing your Instagram connection, please wait...</p>
    </div>
  );
}

export default function InstagramConnectPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="h-16 w-16 animate-spin text-purple-600 mb-4" />
                <p className="text-lg text-gray-700">Loading...</p>
            </div>
        }>
            <InstagramConnectComponent />
        </Suspense>
    );
}