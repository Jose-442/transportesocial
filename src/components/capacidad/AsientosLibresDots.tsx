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
  const libres = ofrecidasClamped - ocupadasClamped;
  const dotSize = sizeClasses[size];

  return (
    <div
      className="flex items-center gap-2"
      role="img"
      aria-label={`${libres} asiento${libres !== 1 ? "s" : ""} libre${
        libres !== 1 ? "s" : ""
      }`}
    >
      {Array.from({ length: libres }, (_, i) => (
        <span
          key={i}
          className={`inline-block rounded-full ${dotSize} bg-emerald-500`}
          aria-label={`Plaza libre ${i + 1}`}
        />
      ))}
    </div>
  );
}
