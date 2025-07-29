import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { verifyToken } from "@/lib/verifyToken";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { caption } = await req.json();
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const user = await User.findById(decoded.userId);

  if (user.requests == 3) {
    return NextResponse.json(
      { error: "Caption requests exceeded" },
      { status: 409 }
    );
  }

  if (!caption) {
    return NextResponse.json({ error: "Caption is required" }, { status: 400 });
  }
  const prompt = `You are a viral content expert helping short-form creators (YouTube Shorts, Instagram Reels, TikTok) write better captions.

Analyze the following caption:

"${caption}"

Evaluate it on these 7 factors. Give scores out of 10 (or Yes/No for CTA), and provide improvement suggestions.

**Scoring Criteria:**
1. **Catchiness** – How attention-grabbing is the caption overall?
2. **Grammar Check** – Are there any spelling, punctuation, or grammar issues?
3. **Caption Clarification** – Is the message clear and easy to understand?
4. **Hashtag Usage** – Are hashtags relevant, niche-specific, and discovery-optimized?
5. **Hook Strength** – Are the first 5–10 words compelling and scroll-stopping?
6. **Call-to-Action (CTA) Presence** – Does it include CTAs like “Save this”, “Watch till end”, etc.?
7. **Tone Detection** – What is the overall tone? (funny, emotional, educational, sarcastic, etc.)

Then provide:

- Brief suggestions to improve the original caption
- **3 improved versions** of the caption that:
  - Are more trendy and viral
  - Include **more relevant emojis at least four of them** naturally placed
  - Use strong hooks
  - Include a CTA (if it makes sense)
  - Use better or additional hashtags minimum four of them

For each improved caption, provide:
- The full caption text
- The same 7-point score breakdown

**Output JSON structure:**

{
  "original_analysis": {
    "catchiness": 6,
    "grammar": 9,
    "clarification": 8,
    "hashtag_usage": 5,
    "hook_strength": 6,
    "cta_present": "No",
    "tone": "Informative",
    "suggestions": [
      "Use a more engaging hook.",
      "Add 2–3 emojis for emotional punch.",
      "Include a clear call-to-action.",
      "Use niche-specific hashtags."
    ]
  },
  "improved_captions": [
    {
      "text": "Nobody talks about these 5 insane weight loss hacks 😱🔥 #FitnessTips #LoseWeightFast",
      "scores": {
        "catchiness": 9,
        "grammar": 10,
        "clarification": 9,
        "hashtag_usage": 8,
        "hook_strength": 9,
        "cta_present": "Yes",
        "tone": "Excited"
      }
    },
    ...
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const aiRaw = completion.choices[0].message.content || "";

  user.requests += 1;
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
