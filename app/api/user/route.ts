import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/verifyToken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const user = await User.findById(decoded.userId);
  return NextResponse.json({
    data: user,
    message: "User fetched Successfully",
  });
}
