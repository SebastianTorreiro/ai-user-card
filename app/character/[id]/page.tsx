import { ChampionCard } from "@/components/ChampionCard"; // <--- Importamos el nuevo componente
import { getCharacterFromDB } from "@/lib/data";
import Link from "next/link";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getCharacterFromDB(id);

  if (!character) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#091428] text-white">
        <h1 className="text-2xl font-bold mb-4 text-[#c8aa6e]">Campeón no encontrado</h1>
        <Link href="/" className="text-blue-400 hover:underline">Volver a la Grieta</Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#091428] p-4 font-sans relative">
      
      {/* Fondo Hextech decorativo */}
      <div className="absolute inset-0 bg-[url('https://lolstatic-a.akamaihd.net/frontpage/apps/prod/harbinger/4-0-0/assets/img/sr-background.jpg')] bg-cover opacity-20 pointer-events-none"></div>

      <div className="mb-8 text-center z-10">
        <Link 
          href="/" 
          className="text-[#c8aa6e] mt-4 inline-block hover:text-[#f0e6d2] transition-colors text-xs font-bold uppercase tracking-widest border-b border-transparent hover:border-[#c8aa6e]"
        >
          ← Crear otro Campeón
        </Link>
      </div>

      <div className="z-10 w-full flex justify-center animate-in zoom-in-95 duration-700">
        {/* USAMOS EL NUEVO COMPONENTE */}
        <ChampionCard
            name={character.name}
            title={character.title}
            class={character.class}
            region={character.region}
            lore={character.lore}
            image={character.image}
            stats={character.stats}
            abilities={character.abilities}
        />
      </div>
    </div>
  );
}