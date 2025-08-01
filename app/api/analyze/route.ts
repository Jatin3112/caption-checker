import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { getToken } from "next-auth/jwt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { caption, captionVibe } = await req.json();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(token._id);

  const planLimits: Record<string, number> = {
    free: 2,
    starter: 2,
    popular: 3,
    pro: 4,
  };

  const plan = user.plan || "free";
  const limit = planLimits[plan] || 2;

  if (user.requests >= user.maxRequests) {
    return NextResponse.json(
      {
        error:
          "Caption request limit reached, please upgrade your plan from the pricing tab in Navbar",
      },
      { status: 409 }
    );
  }

  if (!caption) {
    return NextResponse.json({ error: "Caption is required" }, { status: 400 });
  }
  const prompt = `You are a top-tier viral content strategist for short-form platforms like YouTube Shorts, Instagram Reels, and TikTok.

Your job is to analyze and improve the following caption to make it more viral, engaging, and platform-optimized:

---

### 📌 User-defined Vibe:
"${captionVibe}"

**Try to align the tone and improvements with this vibe where possible.**

---

"${caption}"

---

### Analyze this caption on 7 key performance factors:

Give scores from **1 to 10**, or **Yes/No** for CTA. Keep each score **strict and realistic**, as if evaluating for a viral creator campaign.

**Scoring Criteria:**
1. **Catchiness** – Does it immediately grab attention or create curiosity?
2. **Grammar Check** – Are there any spelling, grammar, or punctuation issues?
3. **Caption Clarity** – Is the message easy to understand on a first read?
4. **Hashtag Strategy** – Are the hashtags relevant, niche-targeted, and optimized for discovery?
5. **Hook Strength** – Are the first 5–10 words scroll-stopping or pattern-breaking?
6. **Call-to-Action (CTA)** – Is there an effective CTA like “Save this”, “Watch till the end”, “Comment below”, etc.?
7. **Tone** – Identify the tone: e.g. Informative, Entertaining, Emotional, Sarcastic, Motivational, Dramatic, Urgent, etc.

---

### Then do the following:

**1. Suggest ways to improve the original caption**, including:
- Hook changes
- Emoji placement
- CTA ideas
- Hashtag improvements

**2. Generate ${limit} highly improved, viral-style caption alternatives** that:
- Use **strong hooks** in the first 5–10 words
- Include **at least 4 relevant emojis** (naturally placed, not forced)
- Have a clear **CTA** (if it fits context)
- Use **at least 4 niche-specific and viral hashtags**
- Are trend-aware, emotionally punchy, and easy to scan in 1–2 seconds

---

### Output your answer in this **JSON format**:

{
  "original_analysis": {
    "catchiness": <score>,
    "grammar": <score>,
    "clarity": <score>,
    "hashtag_usage": <score>,
    "hook_strength": <score>,
    "cta_present": "Yes" or "No",
    "tone": "<detected tone>",
    "suggestions": [
      "<suggestion 1>",
      "<suggestion 2>",
      ...
    ]
  },
  "improved_captions": [
    {
      "text": "<improved caption>",
      "scores": {
        "catchiness": <score>,
        "grammar": <score>,
        "clarity": <score>,
        "hashtag_usage": <score>,
        "hook_strength": <score>,
        "cta_present": "Yes" or "No",
        "tone": "<new tone>"
      }
    },
    ...
  ]
}
`;

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
