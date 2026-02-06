import { UserCard } from "@/components/UserCard";
import { getCharacterFromDB } from "@/lib/data"; // Importamos la función que acabamos de extraer
import Link from "next/link"; // Para el botón de "Volver"

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>; // En Next.js 15, params es una promesa
}) {
  const { id } = await params;
  const character = await getCharacterFromDB(id);

  if (!character) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Personaje no encontrado 😢</h1>
        <Link href="/" className="text-blue-400 hover:underline">
          Volver a crear uno
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4 font-sans">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          {character.name}
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          {
            character.role /* Asegúrate de que getCharacterFromDB devuelva el rol */
          }
        </p>
        <Link
          href="/"
          className="text-slate-400 mt-4 inline-block hover:text-white transition-colors text-sm"
        >
          ← Crear otro personaje
        </Link>
      </div>

      {/* Reutilizamos tu componente estrella */}
      <UserCard
        name={character.name}
        email={character.email}
        city={character.city}
        company={character.company}
        image={character.image}
      />
    </div>
  );
}
