import { supabase } from "@/lib/supabase";

// Función 1: Buscar un personaje por su ID (Para la página de detalle)
export async function getCharacterFromDB(id: string) {
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error DB:", error);
    return null;
  }
  return {
    name: data.name,
    title: data.title || "El Olvidado",
    class: data.class || data.role || "Desconocido", // Fallback
    region: data.region || data.company || "Runaterra", // Fallback
    lore: data.lore || "Historia no disponible.",
    image: data.image_url,

    stats: data.stats || {
      health: 500,
      attackDamage: 60,
      armor: 30,
      magicResist: 30,
      moveSpeed: 330,
    },
    abilities: data.abilities || {
      passive: { name: "Pasiva", description: "..." },
      q: { name: "Q", description: "..." },
      w: { name: "W", description: "..." },
      e: { name: "E", description: "..." },
      r: { name: "R", description: "..." },
    },
  };
}

export async function getLatestCharacters() {
  const { data, error } = await supabase
    .from("characters")
    .select("id, name, class, region, image_url")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching latest:", error);
    return [];
  }

  return data.map((char) => ({
    ...char,
    role: char.class || "Campeón",
  }));
}
