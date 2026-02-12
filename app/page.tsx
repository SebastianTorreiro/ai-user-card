import { SearchForm } from "@/components/SearchForm";
import { ChampionCard } from "@/components/ChampionCard"; // <--- Nuevo Componente
import { getCharacterFromDB, getLatestCharacters } from "@/lib/data";

type GalleryCharacter = {
  id: string;
  name: string;
  role: string;
  image_url: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const latestCharacters = await getLatestCharacters();
  const params = await searchParams;
  const { id } = params;

  let characterData = null;

  if (id) {
    characterData = await getCharacterFromDB(id);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-[#c8aa6e]/30">
      <div className="absolute inset-0 z-0 bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat fixed"></div>

      <div className="absolute inset-0 z-0 bg-[#091428]/30 mix-blend-multiply"></div>

      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#000000_100%)] opacity-40"></div>

      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#c8aa6e1a_1px,transparent_1px),linear-gradient(to_bottom,#c8aa6e1a_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      <div className="container px-4 md:px-6 flex flex-col items-center max-w-6xl relative z-10">
        <div className="mb-12 text-center space-y-6 pt-10 px-4">
          {/* TÍTULO PRINCIPAL */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#f0e6d2] to-[#c8aa6e] drop-shadow-[0_4px_10px_rgba(0,0,0,1)] pb-4 leading-tight uppercase filter">
            {characterData ? characterData.name : "MOBA Architect"}
          </h1>

          {/* SUBTÍTULO CORREGIDO (Estilo Pill/Burbuja) */}
          <div className="flex justify-center">
            <p className="text-[#f0e6d2] text-xl md:text-2xl max-w-3xl font-serif italic leading-relaxed drop-shadow-md bg-[#000000]/60 px-8 py-3 rounded-full border border-[#c8aa6e]/30 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              {characterData
                ? characterData.title
                : "Forja el próximo campeón de la Grieta con Inteligencia Artificial."}
            </p>
          </div>
        </div>

        {!characterData && <SearchForm />}

        {characterData ? (
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
          latestCharacters &&
          latestCharacters.length > 0 && (
            <div className="mt-16 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#c8aa6e]"></div>
                <span className="text-[#c8aa6e] text-xs font-bold uppercase tracking-[0.3em] drop-shadow-lg">
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
                    <div className="h-48 w-full overflow-hidden relative bg-[#0a0a12]">
                      <img
                        src={char.image_url}
                        alt={char.name}
                        className="w-full h-full object-cover object-[50%_20%] opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#091428] via-transparent to-transparent opacity-90"></div>
                    </div>

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
