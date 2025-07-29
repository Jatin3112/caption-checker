import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  await connectDB();
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const user = await User.findOne({
    verifyEmailToken: token,
  });

  if (!user) {
    return NextResponse.json(
      { error: "Token expired or invalid" },
      { status: 400 }
    );
  }

  user.verified = true;
  user.verifyEmailToken = null;
  await user.save();

  return NextResponse.json({
    status: 200,
    message: "User Verified Successfully",
  });
}
