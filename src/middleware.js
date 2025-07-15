import { NextResponse } from "next/server";
import { jwtVerify } from 'jose';


const verifyToken = async (token) => {
  if (!token) {
    console.log('[Middleware] No token provided');
    return null;
  }
  try {
    if (!process.env.JWT_SECRET) {
      console.error('[Middleware] JWT_SECRET is not defined in environment variables');
      return null;
    }
    console.log('[Middleware] Attempting to verify token with JWT_SECRET');
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log('[Middleware] Token verified successfully:', payload);
    return payload;
  } catch (error) {
    console.error('[Middleware] Token verification failed:', error.message);
    return null;
  }
};


export async function middleware(request) {
  
  const { pathname } = request.nextUrl;

   const isJustLoggedIn = request.cookies.get('isJustLoggedIn')?.value === 'true';

 
  if (pathname.startsWith('/dashboard') && isJustLoggedIn) {
    console.log('[Middleware] Detected "isJustLoggedIn" flag, allowing access and clearing flag.');
    const response = NextResponse.next();
    
    response.cookies.set('isJustLoggedIn', '', { maxAge: -1 }); 
    return response;
  }

 
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/verify',
    '/auth/request-password-reset',
    '/auth/reset-password',
    '/',
    '/home',
    '/pricing'
  ];
  
  const isPublicPath = publicPaths.includes(pathname);
  const isDashboardPath = pathname.startsWith('/dashboard');

  console.log('[Middleware] Path type:', {
    isPublicPath,
    isDashboardPath,
    pathname
  });

  // Get token from cookie
  const token = request.cookies.get("token")?.value;
  console.log('[Middleware] Token from cookies:', token ? 'Present' : 'Not present');

  // Verify token
  const verifiedToken = await verifyToken(token);
  console.log('[Middleware] Token verification result:', verifiedToken ? 'Valid' : 'Invalid');

  // Debug current state
  console.log('[Middleware] Current state:', {
    pathname,
    isPublicPath,
    isDashboardPath,
    hasToken: !!token,
    isVerified: !!verifiedToken,
    env: {
      hasJwtSecret: !!process.env.JWT_SECRET
    }
  });

 
  if (isDashboardPath && !verifiedToken) {
    console.log('[Middleware] Unauthorized dashboard access, redirecting to login');
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isPublicPath && verifiedToken && pathname !== '/') {
    console.log('[Middleware] Authenticated user accessing public path, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('[Middleware] Allowing request to proceed');
  return NextResponse.next();
}

// Update config to match all paths we want to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 