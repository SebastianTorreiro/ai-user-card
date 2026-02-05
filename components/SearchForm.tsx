"use client";

import { createCharacterAction } from "@/app/action";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SearchForm() {
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const initialRole = searchParams.get("role") || "";

  return (
    <form // Envolvemos la llamada en startTransition para que isPending se active
      action={(formData) => {
        startTransition(() => {
          createCharacterAction(formData);
        });
      }}
      className="w-full max-w-md mb-8 flex gap-2"
    >
      <input
        name="roleInput"
        defaultValue={initialRole}
        disabled={isPending}
        type="text"
        placeholder="Ej: Cazador de Dragones..."
        className={`flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500
          ${isPending ? "opacity-50 cursor-not-allowed" : ""} 
        `}
        autoComplete="off"
      />

      <button
        type="submit"
        disabled={isPending}
        className={`font-medium px-6 py-2 rounded-lg transition-colors text-white
          ${
            isPending
              ? "bg-slate-600 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700"
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
