import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const { userId, planId, paymentId } = await req.json();

  if (!userId || !planId || !paymentId) {
    return NextResponse.json(
      { message: "All fields are necesasary" },
      { status: 401 }
    );
  }

  const planLimits: Record<string, number> = {
    starter: 10,
    popular: 60,
    pro: 150,
  };

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found for payment" },
        { status: 401 }
      );
    }

    user.plan = planId;
    user.paymentId = paymentId;
    user.maxRequests = planLimits[planId] || 3;

    await user.save();

    return NextResponse.json({
      message: "Payment Completed Successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
