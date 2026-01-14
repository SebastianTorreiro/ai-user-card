import { UserCard } from "@/components/UserCard";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

// Esquema de datos (Igual que antes)
const userSchema = z.object({
  name: z.string().describe("Nombre completo del personaje"),
  email: z.string().email().describe("Email ficticio"),
  city: z.string().describe("Ciudad de origen"),
  company: z.string().describe("Nombre de su facción o empresa"),
});

async function generateUserProfile(role: string) {
  "use server";

  try {
    // CAMBIO CLAVE 1: Usamos 'models/gemini-1.5-pro-latest'
    // A veces 'flash' da problemas de región/nombre en la beta. Pro es más estable.
    const result = await generateObject({
      model: google("models/gemini-2.5-flash"), 
      schema: userSchema,
      prompt: `Genera un perfil de usuario DETALLADO y CREATIVO para un: ${role}.`,
    });

    return result.object;
  } catch (error) {
    console.error("Error conectando con Gemini:", error);
    // Fallback de emergencia
    return {
      name: "Error de Conexión",
      email: "api@google.com",
      city: "Revisa tu API Key",
      company: "Google Cloud",
    };
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const params = await searchParams;
  const currentRole = params?.role || "Jardinero que quiere ser Dev";

  const user = await generateUserProfile(currentRole);

  return (
    // CAMBIO VISUAL: Fondo oscuro profesional (gris plomo), tipografía centrada
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4 font-sans">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 capitalize">
          {currentRole}
        </h1>
        <p className="text-slate-400 mt-2">Perfil generado por IA</p>
      </div>
      
      <UserCard 
        name={user.name}
        email={user.email}
        city={user.city}
        company={user.company}
      />

      <div className="mt-12 p-4 border border-slate-700 rounded-lg bg-slate-800/50 text-slate-300 text-sm">
        <p className="mb-2">Prueba otros roles en la URL:</p>
        <div className="flex gap-2 flex-wrap">
           <span className="px-2 py-1 bg-slate-700 rounded text-xs">?role=Elon Musk</span>
           <span className="px-2 py-1 bg-slate-700 rounded text-xs">?role=Orco Guerrero</span>
        </div>
      </div>
    </div>
  );
}