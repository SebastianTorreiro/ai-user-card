"use server";

import { redirect } from "next/navigation";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { ChampionSchema, ChampionFormSchema } from "@/lib/schemas";

export async function createCharacterAction(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    class: formData.get("class"),
    region: formData.get("region"),
    prompt: formData.get("prompt"),
  };

  const validation = ChampionFormSchema.safeParse(rawData);

  if (!validation.success) {
    console.error("Validation Error:", validation.error.format());
    throw new Error("Datos inválidos en el formulario.");
  }

  const {
    name,
    class: charClass,
    region,
    prompt: userPrompt,
  } = validation.data;

  const systemPrompt = `
    Eres un Lead Game Designer experto en MOBAs (como LoL o Dota).
    Tu tarea es diseñar un nuevo Campeón coherente, balanceado y con mecánicas únicas.

    Reglas de Diseño:
    1. Sinergia: Las habilidades deben interactuar entre sí (Ej: La Q marca, la E detona).
    2. Temática: Todo (Lore, Habilidades, Título) debe encajar con la Región "${region}" y la Clase "${charClass}".
    3. Balance: No hagas habilidades "rotas" (OP). Usa cooldowns y costos de maná realistas.
    4. Iconos: Los 'iconPrompt' deben ser descriptivos visualmente para generar iconos vectoriales.
    
    Detalles del Usuario: ${userPrompt ? `El usuario pide: "${userPrompt}"` : "Sé creativo."}
  `;

  let champion;
  try {
    const result = await generateObject({
      model: google("models/gemini-2.5-flash"),
      schema: ChampionSchema,
      system: systemPrompt,
      prompt: `Diseña a "${name}", un ${charClass} de ${region}.`,
    });
    champion = result.object;
  } catch (error) {
    console.error("AI Error:", error);
    throw new Error("La IA no pudo diseñar el campeón.");
  }

  const imageUrl = `/api/image?prompt=${encodeURIComponent(champion.visualDescription + ", league of legends splash art style, high quality, 4k")}`;

  const { data, error } = await supabase
    .from("characters")
    .insert([
      {
        name: champion.name,
        title: champion.title,
        class: champion.class,
        region: champion.region,
        lore: champion.lore,
        stats: champion.stats,
        abilities: champion.abilities,

        role: champion.class,
        description: champion.visualDescription,
        image_url: imageUrl,
        company: champion.region, 
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("DB Error:", error);
    throw new Error("Falló el guardado en base de datos.");
  }

  redirect(`/character/${data.id}`);
}
