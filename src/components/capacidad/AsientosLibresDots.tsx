import { MAX_ASIENTOS_POR_VIAJE } from "@/lib/constants";

type Props = {
  ofrecidas: number;
  ocupadas: number;
  max?: number;
  size?: "sm" | "md";
};

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
};

export function AsientosLibresDots({
  ofrecidas,
  ocupadas,
  max = MAX_ASIENTOS_POR_VIAJE,
  size = "md",
}: Props) {
  const ofrecidasClamped = Math.min(max, Math.max(0, ofrecidas));
  const ocupadasClamped = Math.min(ofrecidasClamped, Math.max(0, ocupadas));
  const dotSize = sizeClasses[size];

  return (
    <div
      className="flex items-center gap-2"
      role="img"
      aria-label={`${ofrecidasClamped - ocupadasClamped} asiento${
        ofrecidasClamped - ocupadasClamped !== 1 ? "s" : ""
      } libre${ofrecidasClamped - ocupadasClamped !== 1 ? "s" : ""} de ${ofrecidasClamped}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        let estado: "libre" | "ocupada" | "no-ofrecida";
        if (index > ofrecidasClamped) {
          estado = "no-ofrecida";
        } else if (index <= ocupadasClamped) {
          estado = "ocupada";
        } else {
          estado = "libre";
        }

        const color =
          estado === "libre"
            ? "bg-emerald-500"
            : estado === "ocupada"
              ? "bg-red-500"
              : "bg-zinc-200";

        const label =
          estado === "libre"
            ? "libre"
            : estado === "ocupada"
              ? "ocupada"
              : "no ofrecida";

        return (
          <span
            key={i}
            className={`inline-block rounded-full ${dotSize} ${color}`}
            aria-label={`Plaza ${index}: ${label}`}
          />
        );
      })}
    </div>
  );
}
