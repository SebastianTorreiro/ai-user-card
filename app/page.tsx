import { SearchForm } from "@/components/SearchForm";
import { UserCard } from "@/components/UserCard";
import { getCharacterFromDB } from "@/lib/data";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().describe("Nombre completo del personaje"),
  email: z.string().email().describe("Email ficticio"),
  city: z.string().describe("Ciudad de origen"),
  company: z.string().describe("Nombre de su facción o empresa"),
  visualDescription: z
    .string()
    .describe(
      "Descripción física visual del personaje para generar una imagen. En Inglés. Ej: 'A cyberpunk warrior with glowing armor'",
    ),
});

type UserProfile = z.infer<typeof userSchema>;

async function generateUserProfile(role: string): Promise<UserProfile> {
  "use server";

  try {
    const result = await generateObject({
      model: google("models/gemini-2.5-flash"),
      schema: userSchema,
      prompt: `Genera un perfil de usuario DETALLADO y CREATIVO para un: ${role}.
       Asegúrate de crear una 'visualDescription' detallada y artística en inglés.`,
    });

    return result.object;
  } catch (error) {
    console.error("Error conectando con Gemini:", error);
    return {
      name: "Error de Conexión",
      email: "error@ai.system",
      city: "404 Valley",
      company: "Offline Inc.",
      visualDescription:
        "A glitchy computer screen displaying a system error, cyberpunk style, dark colors", // <--- AGREGADO
    };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; id?: string }>;
}) {
  const params = await searchParams;
  const { role, id } = params;
  let characterData;

  if (id) {
    const dbUser = await getCharacterFromDB(id);
    if (dbUser) {
      characterData = dbUser;
    }
  } else if (role) {
    const aiUser = await generateUserProfile(role);
    const generatedImage = `/api/image?prompt=${encodeURIComponent(aiUser.visualDescription)}`;
    characterData = {
      ...aiUser,
      image: generatedImage,
    };
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4 font-sans">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 capitalize">
          {role}
        </h1>
        <p className="text-slate-400 mt-2">Perfil generado por IA</p>
      </div>

      <SearchForm />
      {characterData && (
        <UserCard
          name={characterData.name}
          email={characterData.email}
          city={characterData.city}
          company={characterData.company}
          image={characterData.image}
        />
      )}
    </div>
  );
}
