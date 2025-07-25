
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import InstagramProvider from "next-auth/providers/instagram";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

if (!BACKEND_API_URL) {
  throw new Error('Missing environment variable: "BACKEND_API_URL"');
}

export const authOptions = {
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }
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
          if (!res.ok || !responseData.user) {
            throw new Error(responseData.message || "Invalid credentials.");
          }
          
          return responseData;
        } catch (e) {
          console.error("Authorize Error:", e);
          throw new Error(e.message || "An unexpected error occurred.");
        }
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
  
    async jwt({ token, user }) {
      
      if (user) {
        token.id = user.user.id;
        token.name = user.user.name;
        token.email = user.user.email;
       
        token.accessToken = user.token;
      }
      return token;
    },
   
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
       
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
