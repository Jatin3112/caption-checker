import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendUserVerificationEmail } from "@/lib/mailer";

// Secret key
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  await connectDB();
  const { fullName, email, password } = await req.json();

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, email, password: hashedPassword });

  // Create JWT payload
  const payload = {
    email: user.email,
  };

  // Sign token
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });

  user.verifyEmailToken = token;
  await user.save();

  const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/confirm-email?token=${token}`;

  await sendUserVerificationEmail(email, verifyLink);

  const newUser = await User.findById(user._id).select(
    "-password -resetToken -resetTokenExp"
  );

  return NextResponse.json({
    message:
      "User created successfully and verification link sent to the user email id",
    data: newUser,
  });
}
