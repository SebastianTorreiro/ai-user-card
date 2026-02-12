"use client";

import { useTransition } from "react";
import { createCharacterAction } from "@/app/action";
import { CLASSES, REGIONS } from "@/lib/schemas"; 

export function SearchForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form 
      action={(formData) => {
        startTransition(() => {
          createCharacterAction(formData);
        });
      }} 
      className="w-full max-w-4xl bg-[#091428]/80 backdrop-blur-md border border-[#c8aa6e]/30 p-8 rounded-sm shadow-2xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="name" className="text-xs font-bold text-[#c8aa6e] uppercase tracking-widest">Nombre del Campeón</label>
          <input
            name="name"
            id="name"
            required
            minLength={2}
            maxLength={20}
            type="text"
            placeholder="Ej: Aatrox, Ahri..."
            className="w-full bg-[#0a0a12] border border-[#1e2328] text-[#f0e6d2] text-lg px-4 py-3 focus:outline-none focus:border-[#c8aa6e] transition-colors placeholder-slate-700"
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="class" className="text-xs font-bold text-[#c8aa6e] uppercase tracking-widest">Clase / Rol</label>
          <select
            name="class"
            id="class"
            className="w-full bg-[#0a0a12] border border-[#1e2328] text-[#f0e6d2] px-4 py-3 appearance-none focus:border-[#c8aa6e] cursor-pointer"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="region" className="text-xs font-bold text-[#c8aa6e] uppercase tracking-widest">Región de Runaterra</label>
          <select
            name="region"
            id="region"
            className="w-full bg-[#0a0a12] border border-[#1e2328] text-[#f0e6d2] px-4 py-3 appearance-none focus:border-[#c8aa6e] cursor-pointer"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label htmlFor="prompt" className="text-xs font-bold text-[#c8aa6e] uppercase tracking-widest">Detalles Especiales (Opcional)</label>
          <textarea
            name="prompt"
            id="prompt"
            rows={2}
            placeholder="Ej: Usa una guadaña gigante, tiene odio por los magos..."
            className="w-full bg-[#0a0a12] border border-[#1e2328] text-[#f0e6d2] px-4 py-3 focus:outline-none focus:border-[#c8aa6e] transition-colors placeholder-slate-700 resize-none"
          />
        </div>

      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="submit"
          disabled={isPending} 
          className={`font-bold text-lg px-12 py-3 border border-[#c8aa6e] transition-all text-[#f0e6d2] uppercase tracking-widest shadow-[0_0_15px_rgba(200,170,110,0.2)]
            ${
              isPending
                ? "bg-[#1e2328] cursor-wait opacity-50" 
                : "bg-[#1e2328] hover:bg-[#c8aa6e] hover:text-[#0a0a12] hover:shadow-[0_0_25px_rgba(200,170,110,0.6)]" 
            }
          `}
        >
          {isPending ? "Invocando..." : "Crear Campeón"}
        </button>
      </div>
    </form>
  );
}