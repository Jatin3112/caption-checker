// app/api/auth/forgot/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "@/lib/mailer";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  await connectDB();
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const resetToken = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
  const resetTokenExp = new Date(Date.now() + 15 * 60 * 1000);

  user.resetToken = resetToken;
  user.resetTokenExp = resetTokenExp;
  await user.save();

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;
  await sendResetEmail(email, resetLink);

  return NextResponse.json({ message: "Reset link sent to your email." });
}
