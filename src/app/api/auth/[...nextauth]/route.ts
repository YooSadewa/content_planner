import axios from "axios";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            "http://127.0.0.1:8000/api/login",
            credentials,
            {
              validateStatus(status) {
                return status >= 200 && status < 300;
              },
            }
          );

          if (res.status === 200) {
            return res.data.data.admin; // Perbaikan: Langsung return `admin`
          } else {
            return null;
          }
        } catch (error) {
          console.error("Login Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.user_id;
        token.name = user.user_name;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }: any) {
      session.user = {
        id: token.id,
        name: token.name,
        username: token.username,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
