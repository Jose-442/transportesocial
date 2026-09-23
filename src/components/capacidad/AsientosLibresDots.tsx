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
  const ocupadasClamped = Math.min(max, Math.max(0, ocupadas));
  const libres = Math.max(
    0,
    ofrecidasClamped - Math.min(ocupadasClamped, ofrecidasClamped)
  );
  const dotSize = sizeClasses[size];

  return (
    <div
      className="flex items-center gap-2"
      role="img"
      aria-label={`${libres} asiento${libres !== 1 ? "s" : ""} libre${
        libres !== 1 ? "s" : ""
      } de ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const ocupado = i < ocupadasClamped;
        const ofrecido = i < ofrecidasClamped;
        const color = ocupado
          ? "bg-zinc-300"
          : ofrecido
            ? "bg-emerald-500"
            : "bg-zinc-200";
        return (
          <span
            key={i}
            className={`inline-block rounded-full ${dotSize} ${color}`}
            aria-label={
              ocupado
                ? `Plaza ocupada ${i + 1}`
                : ofrecido
                  ? `Plaza libre ${i + 1}`
                  : `Plaza no ofrecida ${i + 1}`
            }
          />
        );
      })}
    </div>
  );
}
