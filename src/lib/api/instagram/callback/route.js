// src/app/api/instagram/callback/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Handle the case where the user denied access
  if (error) {
    console.error('Instagram login error:', searchParams.get('error_description'));
    // Redirect to a page with an error message
    return NextResponse.redirect(new URL('/login-error', request.url));
  }

  // If there's no code, it's an invalid request
  if (!code) {
    return NextResponse.json({ error: 'Invalid request: No code provided' }, { status: 400 });
  }

  try {
    // --- STEP 2: Exchange the Code for a Short-Lived Token ---
    const tokenFormData = new FormData();
    tokenFormData.append('client_id', process.env.INSTAGRAM_APP_ID);
    tokenFormData.append('client_secret', process.env.INSTAGRAM_APP_SECRET);
    tokenFormData.append('grant_type', 'authorization_code');
    tokenFormData.append('redirect_uri', process.env.INSTAGRAM_REDIRECT_URI);
    tokenFormData.append('code', code.replace('#_', '')); // Clean the code

    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: tokenFormData,
    });
    
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Error fetching short-lived token:', tokenData);
      throw new Error(tokenData.error_message || 'Failed to fetch short-lived token');
    }
    
    const shortLivedAccessToken = tokenData.access_token;
    const instagramUserId = tokenData.user_id;

    // --- STEP 3: Exchange the Short-Lived Token for a Long-Lived Token ---
    const longLivedTokenUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_APP_SECRET}&access_token=${shortLivedAccessToken}`;
    
    const longLivedTokenResponse = await fetch(longLivedTokenUrl);
    const longLivedTokenData = await longLivedTokenResponse.json();

    if (!longLivedTokenResponse.ok) {
        console.error('Error fetching long-lived token:', longLivedTokenData);
        throw new Error(longLivedTokenData.error.message || 'Failed to fetch long-lived token');
    }

    const longLivedAccessToken = longLivedTokenData.access_token;
    const expiresIn = longLivedTokenData.expires_in; // Seconds until expiry

    // --- DATA YOU HAVE NOW ---
    console.log('Successfully obtained tokens:');
    console.log('Instagram User ID:', instagramUserId);
    console.log('Long-Lived Access Token:', longLivedAccessToken);
    console.log('Expires In (seconds):', expiresIn);
    
    // --- WHAT TO DO WITH THE DATA ---
    // 1. Save the data to your database
    //    Associate `longLivedAccessToken` and `instagramUserId` with your app's internal user.
    //    It's also wise to save the expiry date: new Date(Date.now() + expiresIn * 1000)
    /*
      await db.users.update({
        where: { id: loggedInUserId }, // You need a way to know which user this is
        data: {
          instagramAccessToken: longLivedAccessToken,
          instagramUserId: instagramUserId,
          instagramTokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
        },
      });
    */
    
    // 2. Create a session for the user (e.g., using JWT, Next-Auth, Iron Session)
    //    This marks them as logged in within your application.

    // 3. Redirect the user to the dashboard
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);

  } catch (err) {
    console.error('Callback handler error:', err);
    // Redirect to a generic error page
    return NextResponse.redirect(new URL('/login-error?message=' + encodeURIComponent(err.message), request.url));
  }
}