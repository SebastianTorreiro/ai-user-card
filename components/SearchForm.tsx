"use client";

import { createCharacterAction } from "@/app/action";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SearchForm() {
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const initialRole = searchParams.get("role") || "";

  return (
    <form
      action={(formData) => {
        startTransition(() => {
          createCharacterAction(formData);
        });
      }}
      className="w-full max-w-2xl mb-12 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000"
    >
      <input
        name="roleInput"
        defaultValue={initialRole}
        disabled={isPending}
        type="text"
        placeholder="Ej: Hechicero cyberpunk con neones..."
        className={`flex-1 bg-slate-800/50 backdrop-blur-md border border-slate-700 text-white text-lg rounded-xl px-6 py-4 
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder-slate-500 shadow-xl transition-all
          ${isPending ? "opacity-50 cursor-not-allowed" : "hover:border-slate-600"} 
        `}
        autoComplete="off"
      />

      <button
        type="submit"
        disabled={isPending}
        className={`font-bold text-lg px-8 py-4 rounded-xl transition-all text-white shadow-lg transform active:scale-95
          ${
            isPending
              ? "bg-slate-700 cursor-wait"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25"
          }
        `}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            ⏳ <span className="hidden sm:inline">Generando...</span>
          </span>
        ) : (
          "Generar"
        )}
      </button>
    </form>
  );
}
