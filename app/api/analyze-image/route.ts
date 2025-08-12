import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  await connectDB();

  const { imageDataUrl } = await req.json();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized, please login to continue" },
      { status: 401 }
    );
  }

  const user = await User.findOne({ email: token.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const planLimits: Record<string, number> = {
    free: 2,
    starter: 2,
    vision: 2,
    popular: 3,
    pro: 4,
  };

  const plan = user?.plan || "free";
  const limit = planLimits[plan] || 2;

  if (user?.imageRequests >= user?.maxImageRequests) {
    return NextResponse.json(
      {
        error:
          "Generating Captions request limit reached, please upgrade your plan",
      },
      { status: 409 }
    );
  }
  const prompt = `You are a viral short-form content strategist specialized in platforms like YouTube Shorts, Instagram Reels, and TikTok.

You are given an image (attached separately) and a user-defined vibe. Your task is to analyze the visual content of the image and generate highly engaging, viral-ready caption options tailored for short-form social media.

---

Match the tone and style of your captions to this vibe as closely as possible.

---

### Your Objective:

Generate ${limit} **improved, scroll-stopping, platform-optimized captions** that are:

- **Hook-first**: The first 5–10 words must be attention-grabbing.
- **Emoji-rich**: Use **at least 4 relevant emojis**, placed naturally.
- **Hashtag-smart**: Include **at least 4 niche-specific + viral hashtags**.
- **CTA-aware**: If the context allows, include a subtle but effective **call-to-action** like "Tag someone", "Save this", "Drop a 🔥 if you agree", etc.
- **Trend-aware**: Use phrases, vibes, or structures that are currently viral or trending.

---

### Output Format (JSON only, no text outside this):

{
  "improved_captions": [
    {
      "text": "<viral caption 1>",
      "scores": {
        "catchiness": <score>,
        "grammar": <score>,
        "clarity": <score>,
        "hashtag_usage": <score>,
        "hook_strength": <score>,
        "cta_present": "Yes" or "No",
        "tone": "<detected tone>"
      }
    },
    ...
  ]
}

ONLY return this JSON array. Do NOT include explanation, caption analysis, or commentary. Focus purely on creating viral-style captions derived directly from the image content.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: imageDataUrl },
          },
        ],
      },
    ],
  });

  const aiRaw = completion.choices[0].message.content || "";

  user.imageRequests += 1;
  user.save();

  // 🧹 Clean up the markdown-style
  const jsonString = aiRaw
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(jsonString);

    return NextResponse.json(parsed); // ✅ Send as proper JSON object
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to parse AI response", raw: jsonString },
      { status: 500 }
    );
  }
}
