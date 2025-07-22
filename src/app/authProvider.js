"use client";

// We can't use the `useSession` hook on the server, so we need to wrap our app in a
// SessionProvider to make the session data available to all client components.

import { SessionProvider } from "next-auth/react";

// This is a client component that wraps our app with the SessionProvider
export default function AuthProvider({ children }) {
  // The SessionProvider component from next-auth/react takes the session object
  // as a prop and makes it available to all child components.
  return <SessionProvider>{children}</SessionProvider>;
}