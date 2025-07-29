import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  await connectDB();
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
  }

  try {
    // 1. Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    // 2. Find user with matching resetToken and check expiration
    const user = await User.findOne({
      _id: decoded.userId,
      email: decoded.email,
      resetToken: token,
      resetTokenExp: { $gt: new Date() }, // check if still valid
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update user’s password and clear resetToken
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExp = null;
    await user.save();

    return NextResponse.json({ message: "Password has been reset successfully." });
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
