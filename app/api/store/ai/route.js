import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";
import { genAI } from "@/configs/gemini";



/* async function main(base64Image, mimeType) {
  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: `
You are a product listing assistant for an e-commerce store.
Analyze the product image and return structured data.

Respond ONLY with raw JSON (no markdown, no explanation).
Schema:
{
  "name": string,
  "description": string
}
            `,
          },
        ],
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this image and return name + description." },
          {
            type: "input_image",
            image_url: `data:${mimeType};base64,${base64Image}`,
          },
        ],
      },
    ],
  });

  const raw =
    response.output_text ||
    response.output?.[0]?.content?.[0]?.text;

  if (!raw) {
    throw new Error("No AI response received");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI did not return valid JSON");
  }

  return parsed;
}

*/



async function analyzeImage(base64Image, mimeType) {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  });

  const prompt = `
You are a product listing assistant for an e-commerce store.

Analyze the product image and return ONLY raw JSON.
No markdown. No explanation.

Schema:
{
  "name": string,
  "description": string
}
`;

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType,
        data: base64Image,
      },
    },
  ]);

  const raw = result.response.text();

  if (!raw) {
    throw new Error("No AI response");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Gemini did not return valid JSON");
  }

  return parsed;
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    const { base64Image, mimeType } = await request.json();

    if (!base64Image || !mimeType) {
      return NextResponse.json(
        { error: "Image data missing" },
        { status: 400 }
      );
    }

    const result = await analyzeImage(base64Image, mimeType);
    return NextResponse.json(result);

  } catch (error) {
  if (error?.message?.includes("429")) {
    return NextResponse.json(
      {
        name: "",
        description: "",
        aiUnavailable: true,
        message: "AI temporarily unavailable. Please enter details manually."
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { error: error.message },
    { status: 400 }
  );
}
} 