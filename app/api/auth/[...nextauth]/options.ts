import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await connectDB();
        try {
          const user = await User.findOne({
            email: credentials.email,
          });

          if (!user) {
            throw new Error("No User found with this email");
          }

          if (!user.verified) {
            throw new Error("Please verify your email");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser && account?.provider === "google") {
        await connectDB();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            fullName: user.name,
            email: user.email,
            password: null,
            verified: true,
            plan: "free",
            requests: 0,
            maxRequests: 3,
            paymentId: null,
          });
        }
      }
    },
  },

  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id;
        session.user.fullName = token.fullName;
        session.user.verified = token.verified;
        session.user.requests = token.requests;
        session.user.plan = token.plan;
        session.user.image = token.picture;
      }
      return session;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token._id = user._id?.toString();
        token.fullName = user.fullName;
        token.verified = user.verified;
        token.requests = user.requests;
        token.plan = user.plan;
        token.image = user.image;
      }

      if (account?.provider === "google") {
        token.loginType = "google";
      }

      return token;
    },
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
