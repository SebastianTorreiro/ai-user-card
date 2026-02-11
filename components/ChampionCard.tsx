"use client";

import { useState } from "react";
import Image from "next/image";

// Definimos la interfaz basada en tu Schema de Zod
// (Podríamos importarla, pero la defino aquí para que veas qué esperamos)
interface Ability {
  name: string;
  description: string;
  cost?: string;
  cooldown?: string;
}

interface ChampionProps {
  name: string;
  title: string;
  class: string;
  region: string;
  lore: string;
  image: string;
  stats: {
    health: number;
    attackDamage: number;
    armor: number;
    magicResist: number;
    moveSpeed: number;
  };
  abilities: {
    passive: Ability;
    q: Ability;
    w: Ability;
    e: Ability;
    r: Ability;
  };
}

export function ChampionCard({ 
  name, title, class: charClass, region, lore, image, stats, abilities 
}: ChampionProps) {
  
  const [activeTab, setActiveTab] = useState<"skills" | "lore" | "stats">("skills");

  return (
    <div className="w-full max-w-4xl bg-[#0a0a12] border border-[#c8aa6e] rounded-sm shadow-2xl overflow-hidden font-sans text-[#f0e6d2]">
      
      {/* HEADER: Splash Art y Título */}
      <div className="relative h-80 w-full group">
        <Image 
          src={image} 
          alt={name} 
          fill 
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-8 w-full">
            <h2 className="text-[#c8aa6e] font-bold tracking-widest uppercase text-sm mb-1">{region} • {charClass}</h2>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-md">{name}</h1>
            <p className="text-xl text-[#a09b8c] font-serif italic">&quot;{title}&quot;</p>
        </div>
      </div>

      {/* NAVEGACIÓN (Tabs estilo LoL) */}
      <div className="flex border-b border-[#1e2328] bg-[#121212]">
        <button 
            onClick={() => setActiveTab("skills")}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors
            ${activeTab === "skills" ? "text-[#c8aa6e] border-b-2 border-[#c8aa6e] bg-[#1e2328]" : "text-gray-500 hover:text-gray-300"}`}
        >
            Habilidades
        </button>
        <button 
            onClick={() => setActiveTab("lore")}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors
            ${activeTab === "lore" ? "text-[#c8aa6e] border-b-2 border-[#c8aa6e] bg-[#1e2328]" : "text-gray-500 hover:text-gray-300"}`}
        >
            Biografía
        </button>
        <button 
            onClick={() => setActiveTab("stats")}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors
            ${activeTab === "stats" ? "text-[#c8aa6e] border-b-2 border-[#c8aa6e] bg-[#1e2328]" : "text-gray-500 hover:text-gray-300"}`}
        >
            Estadísticas
        </button>
      </div>

      {/* CONTENIDO DEL CUERPO */}
      <div className="p-8 min-h-[300px] bg-[#091428]/50">
        
        {/* TAB: HABILIDADES */}
        {activeTab === "skills" && (
            <div className="space-y-6">
                <AbilityRow key="P" hotkey="Pasiva" data={abilities.passive} />
                <AbilityRow key="Q" hotkey="Q" data={abilities.q} />
                <AbilityRow key="W" hotkey="W" data={abilities.w} />
                <AbilityRow key="E" hotkey="E" data={abilities.e} />
                <AbilityRow key="R" hotkey="R" data={abilities.r} isUlt />
            </div>
        )}

        {/* TAB: LORE */}
        {activeTab === "lore" && (
            <div className="prose prose-invert max-w-none">
                <p className="text-[#a09b8c] text-lg leading-relaxed font-serif border-l-2 border-[#c8aa6e] pl-6 italic">
                    {lore}
                </p>
            </div>
        )}

        {/* TAB: STATS */}
        {activeTab === "stats" && (
             <div className="grid grid-cols-2 gap-8">
                <StatBox label="Vida Base" value={stats.health} />
                <StatBox label="Daño de Ataque" value={stats.attackDamage} />
                <StatBox label="Armadura" value={stats.armor} />
                <StatBox label="Resistencia Mágica" value={stats.magicResist} />
                <StatBox label="Velocidad de Mov." value={stats.moveSpeed} />
             </div>
        )}

      </div>
    </div>
  );
}

// Sub-componente para Habilidades
function AbilityRow({ hotkey, data, isUlt }: { hotkey: string, data: Ability, isUlt?: boolean }) {
    return (
        <div className="flex gap-4 group">
            <div className={`
                flex-shrink-0 w-16 h-16 flex items-center justify-center font-black text-2xl border-2
                ${isUlt ? "border-[#c8aa6e] text-[#c8aa6e] bg-[#1e2328]" : "border-slate-700 text-slate-500 bg-slate-900"}
            `}>
                {hotkey}
            </div>
            <div>
                <h3 className={`font-bold uppercase tracking-wide ${isUlt ? "text-[#c8aa6e]" : "text-white"}`}>
                    {data.name}
                </h3>
                <div className="text-xs text-slate-400 mb-2 font-mono">
                    {data.cost && <span>Costo: {data.cost} • </span>}
                    {data.cooldown && <span>Enfriamiento: {data.cooldown}</span>}
                </div>
                <p className="text-[#a09b8c] text-sm leading-relaxed">{data.description}</p>
            </div>
        </div>
    )
}

// Sub-componente para Stats
function StatBox({ label, value }: { label: string, value: number }) {
    return (
        <div className="flex justify-between items-center border-b border-[#1e2328] pb-2">
            <span className="text-slate-400 uppercase text-xs tracking-wider">{label}</span>
            <span className="text-[#f0e6d2] font-bold font-mono">{value}</span>
        </div>
    )
}