// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Secret key 
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Optionally create a JWT here and return it
  // return NextResponse.json({ message: "Login successful", userId: user._id });

  // Create JWT payload
  const payload = {
    userId: user._id,
    fullName: user.fullName,
    email: user.email,
    requests: user.requests,
  };

  // Sign token
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  // Create response with cookie
  const response = NextResponse.json({
    message: "User created successfully",
    accessToken : token,
    data:payload
  });

  response.cookies.set({
    name: "accessToken",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}
