import { SearchForm } from "@/components/SearchForm";
import { UserCard } from "@/components/UserCard";
import { getCharacterFromDB, getLatestCharacters } from "@/lib/data";
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
  role: z.string().describe("Rol del personaje"),
});

type UserProfile = z.infer<typeof userSchema>;

type Character = {
  id: string;
  name: string;
  role: string;
  image_url: string;
};

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
      role: role,
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
  const latestCharacters = await getLatestCharacters();
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 opacity-40 pointer-events-none" />
      
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[130px] -z-10 opacity-40 pointer-events-none" />


      <div className="container px-4 md:px-6 flex flex-col items-center max-w-5xl relative z-10">
        
        <div className="mb-12 text-center space-y-4 pt-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400 drop-shadow-sm pb-4 leading-tight">
             {characterData ? characterData.role : "AI Character Forge"}
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
             {characterData 
                ? "Perfil generado exitosamente." 
                : "Imagina cualquier rol. Nosotros creamos su historia, apariencia y alma."}
          </p>
        </div>

        <SearchForm />

        {characterData ? (
          <div className="animate-in zoom-in-50 duration-500 fade-in slide-in-from-bottom-4">
            <UserCard 
                name={characterData.name}
                email={characterData.email}
                city={characterData.city}
                company={characterData.company}
                image={characterData.image}
            />
          </div>
        ) : (
          latestCharacters && latestCharacters.length > 0 && (
            <div className="mt-8 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-center gap-4 mb-8">
                 <div className="h-px w-12 bg-slate-800"></div>
                 <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Recientes</span>
                 <div className="h-px w-12 bg-slate-800"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestCharacters.map((char: Character) => (
                  <a 
                    key={char.id} 
                    href={`/character/${char.id}`}
                    className="group block bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-xl overflow-hidden hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20"
                  >
                    <div className="h-40 w-full overflow-hidden relative bg-slate-800">
                       <img 
                         src={char.image_url} 
                         alt={char.name} 
                         className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                    </div>
                    
                    <div className="p-4 relative">
                      <h4 className="font-bold text-slate-200 truncate group-hover:text-white transition-colors">{char.name}</h4>
                      <p className="text-xs text-slate-500 truncate group-hover:text-blue-400 transition-colors">{char.role}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
