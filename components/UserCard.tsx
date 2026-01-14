// Definimos la "forma" de los datos que esperamos recibir.
// Esto es TypeScript protegiéndote de errores tontos.
interface UserProps {
  name: string;
  email: string;
  city: string;
  company: string;
}

// El componente ahora recibe "props" (datos), ya no tiene textos fijos.
export function UserCard({ name, email, city, company }: UserProps) {
  return (
    <section className="flex w-full justify-center items-center p-4">
      <div className="flex flex-col items-center justify-center w-full max-w-md rounded-3xl bg-indigo-600 text-white shadow-[8px_4px_4px_black] overflow-hidden">
        <DataRow label="Nombre" value={name} />
        <Separator />

        <DataRow label="Email" value={email} />
        <Separator />

        <DataRow label="Ciudad" value={city} />
        <Separator />

        <DataRow label="Compañía" value={company} />
      </div>
    </section>
  );
}

// Sub-componente para no repetir el HTML de cada fila
// "label" es la etiqueta (ej: Nombre), "value" es el dato (ej: Leanne Graham)
function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-center justify-between px-8 py-6">
      <h3 className="text-lg font-bold text-indigo-200">{label}</h3>
      <p className="text-xl font-medium text-right">{value}</p>
    </div>
  );
}

// Sub-componente para la línea divisoria
function Separator() {
  return <hr className="w-[85%] border-indigo-400" />;
}
