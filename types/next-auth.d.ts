import "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    fullName: string;
    verified?: boolean;
    requests?: number;
    plan: string;
    image?: string;
  }
  interface Session {
    user: {
      _id?: string;
      fullName: string;
      verified?: boolean;
      requests?: number;
      plan: string;
      image?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    fullName: string;
    verified?: boolean;
    requests?: number;
    plan: string;
  }
}
