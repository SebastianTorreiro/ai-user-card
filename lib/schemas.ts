import { z } from "zod";

// --- CONSTANTES DEL JUEGO ---
export const CLASSES = [
  "Luchador", "Tanque", "Mago", "Asesino", "Tirador", "Soporte"
] as const;

export const REGIONS = [
  "Runaterra (Genérico)", "Freljord (Hielo)", "Noxus (Guerra)", "Demacia (Honor)", 
  "Jonia (Magia)", "Piltover (Tech)", "Zaun (Química)", "Islas de la Sombra (Muerte)", "El Vacío (Horror)"
] as const;

export const DAMAGE_TYPES = ["Físico", "Mágico", "Verdadero"] as const;

// --- SCHEMAS DE COMPONENTES ---

// 1. Estadísticas Base (Nivel 1)
const StatsSchema = z.object({
  health: z.number().describe("Vida base (500-700)"),
  mana: z.number().describe("Maná base (300-500) o 0 si usa energía"),
  attackDamage: z.number().describe("Daño de ataque"),
  armor: z.number().describe("Armadura"),
  magicResist: z.number().describe("Resistencia mágica"),
  moveSpeed: z.number().describe("Velocidad de movimiento (325-355)"),
});

// 2. Habilidad (Q, W, E, R)
const AbilitySchema = z.object({
  name: z.string(),
  description: z.string().describe("Descripción corta de qué hace la habilidad"),
  cooldown: z.string().describe("Ej: '10/9/8/7/6s'"),
  cost: z.string().describe("Ej: '50 Maná' o 'Sin costo'"),
  iconPrompt: z.string().describe("Prompt visual breve para el icono de la habilidad (Ej: 'Fireball explosion icon')"),
});

// --- SCHEMA MAESTRO DEL CAMPEÓN ---
export const ChampionSchema = z.object({
  name: z.string(),
  title: z.string().describe("El epíteto (Ej: 'La Espada de los Darkin')"),
  class: z.enum(CLASSES),
  region: z.enum(REGIONS),
  
  lore: z.string().describe("Biografía de 3 parrafos. Origen, conflicto y estado actual."),
  
  stats: StatsSchema,
  
  abilities: z.object({
    passive: AbilitySchema.omit({ cooldown: true, cost: true }).extend({ name: z.string() }), // Pasiva no tiene CD ni Costo usualmente
    q: AbilitySchema,
    w: AbilitySchema,
    e: AbilitySchema,
    r: AbilitySchema.describe("La Ultimate. Debe ser impactante."),
  }),

  visualDescription: z.string().describe("Prompt detallado para la Splash Art del campeón. Estilo Riot Games."),
});

// Schema para el Formulario (Input del usuario)
export const ChampionFormSchema = z.object({
  name: z.string().min(2).max(20).regex(/^[a-zA-Z\s]+$/),
  class: z.enum(CLASSES),
  region: z.enum(REGIONS),
  prompt: z.string().optional().describe("Detalles extra opcionales (Ej: 'Usa una guadaña gigante')"),
});

export type Champion = z.infer<typeof ChampionSchema>;