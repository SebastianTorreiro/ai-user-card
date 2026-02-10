import { supabase } from "@/lib/supabase";

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
    email: "db_saved@personaje.com",
    city: data.city || "Unknown",
    company: data.company || "Free Agent",
    visualDescription: data.description,
    image: data.image_url,
    role: data.role,
  };
}

export async function getLatestCharacters() {
  const { data, error } = await supabase
    .from("characters")
    .select("id, name, role, image_url") 
    .order("created_at", { ascending: false }) 
    .limit(3);

  if (error) {
    console.error("Error fetching latest:", error);
    return [];
  }

  return data;
}
