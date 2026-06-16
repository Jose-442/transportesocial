import Image from "next/image";

export function UserAvatar({
  name,
  avatarUrl,
  size = 64,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: number;
}) {
  const initial = (name.trim()[0] ?? "?").toUpperCase();

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={`Foto de ${name}`}
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-emerald-100"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 ring-2 ring-emerald-200"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden
    >
      {initial}
    </span>
  );
}
