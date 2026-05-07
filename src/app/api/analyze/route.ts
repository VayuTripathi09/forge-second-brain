import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
    const ai = new GoogleGenAI({ apiKey });
    const { input } = await req.json();

    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const prompt = `
You are an expert product manager and technical architect.
Analyze the following raw project thoughts, brainstorms, or messy notes, and convert them into a structured execution plan.

Output strictly as a JSON object with the following schema:
{
  "summary": "A concise, 2-3 sentence overview of the project.",
  "missing_pieces": ["Identify critical gaps or unanswered questions in the product or technical architecture."],
  "next_tasks": ["Top 3 immediate, actionable next steps to start building."],
  "risks": ["Potential technical, product, or go-to-market risks."],
  "roadmap": [
    { "day": "Day 1", "task": "Description of focus for day 1" },
    { "day": "Day 2", "task": "Description of focus for day 2" },
    { "day": "Day 3", "task": "Description of focus for day 3" },
    { "day": "Day 4", "task": "Description of focus for day 4" },
    { "day": "Day 5", "task": "Description of focus for day 5" },
    { "day": "Day 6", "task": "Description of focus for day 6" },
    { "day": "Day 7", "task": "Description of focus for day 7" }
  ]
}

Raw Input:
${input}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const analysis = JSON.parse(text);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Error generating analysis:', error);
    return NextResponse.json({ error: 'Failed to analyze project' }, { status: 500 });
  }
}
