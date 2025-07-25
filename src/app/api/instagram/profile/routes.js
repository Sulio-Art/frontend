
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error('Missing environment variable: "BACKEND_API_URL"');
}

export async function GET(request) {
  console.log("--- [PROXY] /api/instagram/profile route hit ---");

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.accessToken) {
    console.error("[PROXY] Authentication failed: No session token or access token found.");
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  console.log("[PROXY] Session authenticated. Forwarding request to backend.");

  try {
    const response = await fetch(`${BACKEND_API_URL}/api/auth/instagram/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`,
      },
      cache: 'no-store',
    });

    console.log(`[PROXY] Backend responded with status: ${response.status}`);

    const data = await response.json();

    if (!response.ok) {
      console.error("[PROXY] Backend returned an error:", data);
      return NextResponse.json({ message: data.message || 'Error fetching from backend' }, { status: response.status });
    }

    console.log("[PROXY] Successfully fetched data from backend. Sending to client.");
    return NextResponse.json(data);

  } catch (error) {
    console.error('[PROXY] A critical error occurred:', error);
   
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Backend did not return valid JSON. It may have crashed.' }, { status: 502 }); 
    }
    return NextResponse.json({ message: 'Internal Server Error in proxy route' }, { status: 500 });
  }
}