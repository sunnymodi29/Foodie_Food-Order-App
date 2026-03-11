import { NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request) {
  const { question } = await request.json();

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a strict JSON API. Respond ONLY with valid JSON. No explanations.",
          },
          {
            role: "user",
            content: `Give a one-sentence description for this meal in JSON:\n\n{"description": "..." }\n\nMeal: ${question}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const rawAnswer = data.choices[0].message.content.trim();

    try {
      const parsed = JSON.parse(rawAnswer);
      return NextResponse.json({ answer: parsed });
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to connect to AI API" }, { status: 500 });
  }
}
