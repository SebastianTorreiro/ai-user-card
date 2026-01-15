"use client";

import { useSearchParams, useRouter } from "next/navigation";

export function SearchForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialRole = searchParams.get("role") || "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    
    const formData = new FormData(e.currentTarget);
    const role = formData.get("roleInput") as string;

    if (role.trim()) {
      router.push(`/?role=${encodeURIComponent(role)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mb-8 flex gap-2">
      <input
        name="roleInput"
        defaultValue={initialRole} 
        type="text"
        placeholder="Ej: Cazador de Dragones, CEO de Google..."
        className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
        autoComplete="off"
      />
      {/* <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
      >
        Generar
      </button> */}
    </form>
  );
}