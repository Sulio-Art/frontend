
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import InstagramProvider from "next-auth/providers/instagram";

// Ensure this URL points to your deployed backend or your local one for testing.
// It should be defined in your .env.local file.
const BACKEND_API_URL = process.env.BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error('Missing environment variable: "BACKEND_API_URL"');
}

export const authOptions = {
  // NOTE: The MongoDB adapter has been completely removed.
  // NextAuth will use JWT for session management by default.

  providers: [
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      // The logic for Instagram sign-in will be handled in the callbacks.
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is the correct pattern: calling your backend API.
        try {
          const res = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const responseData = await res.json();

          // Check if the request was successful and if user data is present.
          if (!res.ok || !responseData.user) {
            throw new Error(responseData.message || "Invalid credentials.");
          }

          // Return the user object from your backend.
          // Your backend's login response MUST include a 'user' object.
          // e.g., { token: "...", user: { id: "...", email: "...", name: "..." } }
          return responseData.user;

        } catch (e) {
          // Pass any error message to the frontend login form.
          throw new Error(e.message);
        }
      },
    }),
  ],

  session: {
    // We are explicitly using JWTs. This is the correct strategy.
    strategy: "jwt"
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // This callback populates the JWT with data from the user object.
    async jwt({ token, user, account }) {
      // On initial sign-in, the 'user' object from the 'authorize' function is available.
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        // You can add other fields like role here if your backend provides them
        // token.role = user.role;
      }
      
      // If a user signs in with Instagram, the 'account' object is available.
      if (account && account.provider === 'instagram') {
        // Here, you would call your backend to create a user or link the account.
        // For example:
        // await fetch(`${BACKEND_API_URL}/api/auth/oauth/instagram`, {
        //   method: 'POST',
        //   headers: { 'Authorization': `Bearer ${account.access_token}` }
        // });
      }

      return token;
    },
    // This callback makes data from the JWT available to the client-side session object.
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      // session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // Redirect to login on error, with an error message in the URL
  },
};

// Create the handler function using your authOptions
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests, as required by the App Router
export { handler as GET, handler as POST };
