import Link from "next/link";
import { Card } from "@/components/ui/Card";

export function AdminStatCard({
  label,
  value,
  href,
  urgent,
}: {
  label: string;
  value: number;
  href?: string;
  urgent?: boolean;
}) {
  const inner = (
    <Card
      className={[
        "space-y-1",
        urgent && value > 0 ? "border-amber-300 bg-amber-50" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-sm text-zinc-600">{label}</p>
      <p className="text-3xl font-bold text-zinc-900">{value}</p>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-90">
        {inner}
      </Link>
    );
  }

  return inner;
}
