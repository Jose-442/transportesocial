import { DECLARACION_CONDUCTOR } from "@/lib/declaracion-conductor";

export function DeclaracionConductor({
  aceptada,
  onChange,
}: {
  aceptada: boolean;
  onChange: (aceptada: boolean) => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-zinc-300 bg-white p-4">
      <p className="text-sm font-semibold text-zinc-900">
        Declaración obligatoria del conductor
      </p>
      <div className="space-y-3 text-sm leading-relaxed text-zinc-800">
        {DECLARACION_CONDUCTOR.map((parrafo) => (
          <p key={parrafo}>{parrafo}</p>
        ))}
      </div>
      <label className="flex cursor-pointer items-start gap-2 text-sm font-semibold text-zinc-900">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-zinc-300"
          checked={aceptada}
          onChange={(e) => onChange(e.target.checked)}
        />
        Acepto esta declaración.
      </label>
    </div>
  );
}
