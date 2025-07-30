import { NextRequest, NextResponse } from "next/server";
import { sendUserVerificationEmail } from "@/lib/mailer";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// Secret key
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { error: "User Id is necessary" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    // Create JWT payload
    const payload = {
      email: user.email,
    };

    // Sign token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });

    user.verifyEmailToken = token;
    await user.save();

    if (user.verified) {
      return NextResponse.json(
        { message: "User Already verified", alreadyVerified: true },
        { status: 200 }
      );
    }

    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/confirm-email?token=${token}`;

    await sendUserVerificationEmail(user.email, verifyLink);

    return NextResponse.json({
      status: 200,
      message: "Verification email sent",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
