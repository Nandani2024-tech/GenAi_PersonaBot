import { NextRequest, NextResponse } from "next/server";
import { prompts } from "@/lib/prompts";

export const runtime = "nodejs";

type RequestBody = {
  message: string;
  persona: "anshuman" | "abhimanyu" | "kshitij";
};

export async function POST(req: NextRequest) {
  try {
    let body: RequestBody;
    try {
      body = (await req.json()) as RequestBody;
    } catch (jsonError) {
      console.error("Invalid JSON request body:", jsonError);
      return NextResponse.json(
        { reply: "Invalid request payload (bad JSON). Please retry." },
        { status: 400 }
      );
    }
    const { message, persona } = body;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { reply: "Missing GROQ_API_KEY. Add it to `.env` and restart `npm run dev`." },
        { status: 500 }
      );
    }

    const systemPrompt = prompts[persona];
    if (!systemPrompt) {
      return NextResponse.json(
        { reply: "Invalid persona. Please refresh and try again." },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    const rawText = await response.text();
    const text = rawText.replace(/^\uFEFF/, "").trim();
    let data: any = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Upstream Groq non-JSON response:", {
          status: response.status,
          bodyPreview: text.slice(0, 400),
        });
        return NextResponse.json(
          {
            reply:
              "Upstream response was not valid JSON. " +
              `HTTP ${response.status}. ` +
              `Preview: ${text.slice(0, 220)}`,
          },
          { status: 502 }
        );
      }
    }

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ??
        data?.message ??
        `Groq error: HTTP ${response.status}`;
      return NextResponse.json({ reply: errorMessage }, { status: response.status });
    }

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "Error occurred",
    });

  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({
      reply:
        error instanceof Error
          ? `Server error: ${error.message}`
          : "Something went wrong. Please try again.",
    });
  }
}