import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get("prompt");

  if (!prompt) {
    return new NextResponse("Prompt is required", { status: 400 });
  }

  const targetUrl = `https://api.dicebear.com/9.x/notionists/png?seed=${encodeURIComponent(prompt)}&size=512&backgroundColor=c0aede,b6e3f4`;

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return new NextResponse(`Error provider: ${response.statusText}`, {
        status: response.status,
      });
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png", // DiceBear devuelve PNG
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
