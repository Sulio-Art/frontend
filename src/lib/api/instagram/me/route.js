// src/app/api/instagram/me/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  // 1. Get the user's access token from your database/session
  //    This logic depends on how you manage user sessions.
  const accessToken = "PASTE_THE_LONG_LIVED_TOKEN_HERE_FOR_TESTING"; // In reality, get this from DB/session
  const instagramUserId = "PASTE_THE_USER_ID_HERE_FOR_TESTING"; // Get this from DB/session

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // 2. Make an API call to Instagram
    const fields = 'id,username,media_count,account_type';
    const url = `https://graph.instagram.com/${instagramUserId}?fields=${fields}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error.message);
    }

    // 3. Return the data to your client-side component
    return NextResponse.json(data);
  } catch(error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}