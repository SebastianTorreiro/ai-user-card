import { NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const prompt = searchParams.get("prompt");

//   if (!prompt) {
//     return new NextResponse("Prompt is required", { status: 400 });
//   }

//   const targetUrl = `https://api.dicebear.com/9.x/notionists/png?seed=${encodeURIComponent(prompt)}&size=512&backgroundColor=c0aede,b6e3f4`;

//   try {
//     const response = await fetch(targetUrl);

//     if (!response.ok) {
//       return new NextResponse(`Error provider: ${response.statusText}`, {
//         status: response.status,
//       });
//     }

//     const imageBuffer = await response.arrayBuffer();

//     return new NextResponse(imageBuffer, {
//       headers: {
//         "Content-Type": "image/png", // DiceBear devuelve PNG
//         "Cache-Control": "public, max-age=31536000, immutable",
//       },
//     });
//   } catch (error) {
//     console.error("Proxy Error:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

// export const runtime = "edge"; // Opcional, para mayor velocidad si usas Vercel

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const prompt = searchParams.get("prompt");

//   if (!prompt) {
//     return new NextResponse("Prompt is required", { status: 400 });
//   }

//   try {
//     // Usamos el modelo que descubriste
//     const { image } = await experimental_generateImage({
//       model: google.image("imagen-4.0-generate-001"),
//       prompt: prompt,
//       aspectRatio: "1:1", // Opciones: "1:1", "16:9", "4:3"
//     });

//     // La imagen viene en base64, la convertimos a Buffer para enviarla como archivo
//     const imageBuffer = Buffer.from(image.base64, "base64");

//     // Devolvemos la imagen directa (como si fuera un archivo .png)
//     return new NextResponse(imageBuffer, {
//       headers: {
//         "Content-Type": "image/png",
//         "Cache-Control": "public, max-age=31536000, immutable", // Cacheamos para no gastar API
//       },
//     });

//   } catch (error) {
//     console.error("Image Generation Error:", error);
//     // Fallback: Si falla, devolvemos una imagen de error o un placeholder
//     return new NextResponse("Error generating image", { status: 500 });
//   }
// }

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get("prompt");

  if (!prompt) {
    return new NextResponse("Prompt is required", { status: 400 });
  }

  try {
    const safePrompt = prompt.substring(0, 800);
    const styleSufix =
      ", league of legends splash art, masterwork, high quality digital art";

    const encodedPrompt = encodeURIComponent(safePrompt + styleSufix);
    const externalUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true`;

    return NextResponse.redirect(externalUrl);
  } catch (error) {
    console.error("Redirect Error:", error);
    return new NextResponse("Error routing image", { status: 500 });
  }
}
