import { SearchForm } from "@/components/SearchForm";
import { ChampionCard } from "@/components/ChampionCard"; // <--- Nuevo Componente
import { getCharacterFromDB, getLatestCharacters } from "@/lib/data";

// Definimos el tipo localmente para la galería (evitamos 'any')
type GalleryCharacter = {
  id: string;
  name: string;
  role: string; // En data.ts mapeamos 'class' a 'role' para la galería
  image_url: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>; // Ya no esperamos 'role' por URL
}) {
  const latestCharacters = await getLatestCharacters();
  const params = await searchParams;
  const { id } = params;

  let characterData = null;

  // Solo buscamos si hay ID (La generación ahora es via Server Action y redirect)
  if (id) {
    characterData = await getCharacterFromDB(id);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#091428] relative overflow-hidden font-sans selection:bg-[#c8aa6e]/30">
      {/* --- FONDO LOL (Hextech Style & Runaterra) --- */}

      {/* 1. IMAGEN DE FONDO (NUEVO) - Paisaje de Runaterra */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Imagen base */}
        <div className="absolute inset-0 bg-[url('https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt2a81f72e9261d763/5f5835b62b700e5728a50f33/08_Demacia_alt.jpg')] bg-cover bg-center opacity-30 blur-sm"></div>
        {/* Capa de oscurecimiento (Overlay) para contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#091428]/90 via-[#091428]/80 to-[#091428]/95"></div>
      </div>

      {/* 2. Grid Sutil (Ajustado a color Dorado #c8aa6e con baja opacidad) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#c8aa6e1a_1px,transparent_1px),linear-gradient(to_bottom,#c8aa6e1a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-20"></div>

      {/* 3. Glow Dorado (Hextech Magic) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#c8aa6e]/10 rounded-full blur-[120px] -z-10 opacity-40 pointer-events-none" />

      {/* 4. Glow Azul Oscuro (Void/Shadow Isles) */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#0ac8b9]/10 rounded-full blur-[130px] -z-10 opacity-40 pointer-events-none" />

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="container px-4 md:px-6 flex flex-col items-center max-w-6xl relative z-10">
        {/* HERO HEADER */}
        <div className="mb-12 text-center space-y-4 pt-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#f0e6d2] to-[#c8aa6e] drop-shadow-sm pb-4 leading-tight uppercase">
            {characterData ? characterData.name : "MOBA Architect"}
          </h1>
          <p className="text-[#a09b8c] text-xl md:text-2xl max-w-2xl mx-auto font-serif italic leading-relaxed">
            {characterData
              ? characterData.title
              : "Forja el próximo campeón de la Grieta con Inteligencia Artificial."}
          </p>
        </div>

        {/* BUSCADOR (Siempre visible si no hay personaje) */}
        {!characterData && <SearchForm />}

        {/* ZONA DE RESULTADOS */}
        {characterData ? (
          // CASO A: MOSTRAR CAMPEÓN CREADO
          <div className="w-full flex justify-center animate-in zoom-in-95 duration-700 fade-in slide-in-from-bottom-4">
            <ChampionCard
              name={characterData.name}
              title={characterData.title}
              class={characterData.class}
              region={characterData.region}
              lore={characterData.lore}
              image={characterData.image}
              stats={characterData.stats}
              abilities={characterData.abilities}
            />
          </div>
        ) : (
          // CASO B: MOSTRAR GALERÍA
          latestCharacters &&
          latestCharacters.length > 0 && (
            <div className="mt-16 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#c8aa6e]"></div>
                <span className="text-[#c8aa6e] text-xs font-bold uppercase tracking-[0.3em]">
                  Recientes
                </span>
                <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#c8aa6e]"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestCharacters.map((char: GalleryCharacter) => (
                  <a
                    key={char.id}
                    href={`/character/${char.id}`}
                    className="group block bg-[#091428] border border-[#1e2328] rounded-sm overflow-hidden hover:border-[#c8aa6e] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(200,170,110,0.2)]"
                  >
                    {/* Miniatura Imagen */}
                    <div className="h-48 w-full overflow-hidden relative bg-[#0a0a12]">
                      <img
                        src={char.image_url}
                        alt={char.name}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#091428] via-transparent to-transparent opacity-90"></div>
                    </div>

                    {/* Info Miniatura */}
                    <div className="p-4 relative -mt-12 text-center">
                      <h4 className="font-bold text-[#f0e6d2] text-xl uppercase tracking-wider group-hover:text-white transition-colors drop-shadow-md">
                        {char.name}
                      </h4>
                      <p className="text-xs text-[#c8aa6e] uppercase tracking-widest mt-1">
                        {char.role}
                      </p>
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
