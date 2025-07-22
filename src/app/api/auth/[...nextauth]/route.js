import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import InstagramProvider from "next-auth/providers/instagram";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

// The URL of your running backend API from the .env file
const BACKEND_API_URL = process.env.BACKEND_API_URL;

export const authOptions = {
  // The adapter is still used by NextAuth to manage sessions and link OAuth accounts.
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This function now calls YOUR backend API's login endpoint
        try {
          const res = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();

          // If your backend returns an error (res not ok) or no user data
          if (!res.ok || !user) {
            // The error message from your backend will be shown on the login form
            throw new Error(
              user.message ||
                "Invalid credentials. Please check your email and password."
            );
          }

          // If login on the backend is successful, return the user object.
          // The object MUST contain these fields for NextAuth to work correctly.
          return {
            id: user._id, // User ID from your backend's database
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role, // The role from your backend
          };
        } catch (e) {
          // Any error during the fetch or from the backend will be caught
          // and its message will be passed to the frontend.
          throw new Error(e.message);
        }
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // This callback runs when a JWT is created. It adds the role and ID to the token.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // This callback runs when a session is accessed. It adds data to the session object.
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;

      // Now, we must ask the BACKEND if the user has Instagram connected.
      try {
        // NOTE: You must create this endpoint on your backend!
        const res = await fetch(
          `${BACKEND_API_URL}/api/profile/status/${token.id}`
        );
        if (res.ok) {
          const statusData = await res.json();
          session.user.isInstagramConnected =
            statusData.isInstagramConnected || false;
        } else {
          session.user.isInstagramConnected = false;
        }
      } catch (e) {
        console.error("Could not fetch user status from backend:", e);
        session.user.isInstagramConnected = false;
      }

      return session;
    },
  },

  // This `events` block is crucial for telling the backend when an account is linked.
  events: {
    async linkAccount({ user, account }) {
      // This event fires when a user connects a new OAuth account (like Instagram)
      // while already logged in. We send this info to the backend.
      try {
        await fetch(`${BACKEND_API_URL}/api/auth/link-account`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id, // The user's ID in your DB
            provider: account.provider, // e.g., 'instagram'
            providerAccountId: account.providerAccountId, // The user's ID on Instagram
          }),
        });
        console.log("Successfully notified backend of account link.");
      } catch (e) {
        console.error("Failed to link account on backend:", e);
        // You might want to throw an error here to notify the user
      }
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // On error, redirect to login page with an error message
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
