"use server"; 

import { redirect } from "next/navigation";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { supabase } from "@/lib/supabase"; // El alias @ suele apuntar a la raíz si no usas src

// Reutilizamos el esquema para consistencia
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  city: z.string(),
  company: z.string(),
  visualDescription: z.string(),
});

export async function createCharacterAction(formData: FormData) {
  const role = formData.get("roleInput") as string;

  if (!role) return;

  // 1. Generar Texto con IA
  let user;
  try {
    const result = await generateObject({
      model: google("gemini-2.5-flash"), 
      schema: userSchema,
      prompt: `Genera un perfil de usuario para: ${role}. VisualDescription en inglés detallado.`,
    });
    user = result.object;
  } catch (error) {
    console.error("Error IA:", error);
    throw new Error("Falló la generación de IA");
  }

  const imageUrl = `/api/image?prompt=${encodeURIComponent(user.visualDescription)}`;

  const { data, error } = await supabase
    .from("characters")
    .insert([
      {
        name: user.name,
        role: role,
        description: user.visualDescription,
        company: user.company,
        city: user.city,
        image_url: imageUrl,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Error Supabase:", error);
    throw new Error("Falló el guardado en base de datos");
  }

  console.log("Personaje Guardado ID:", data.id);
  
  redirect(`/?saved=true&id=${data.id}`);
}