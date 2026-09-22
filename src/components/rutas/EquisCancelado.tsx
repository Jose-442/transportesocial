export function EquisCancelado() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        x1="4"
        y1="5"
        x2="96"
        y2="95"
        stroke="rgb(185 28 28)"
        strokeOpacity="0.38"
        strokeWidth="22"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1="96"
        y1="5"
        x2="4"
        y2="95"
        stroke="rgb(185 28 28)"
        strokeOpacity="0.38"
        strokeWidth="22"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
