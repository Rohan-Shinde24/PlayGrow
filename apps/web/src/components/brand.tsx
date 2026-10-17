import Link from "next/link";
import { Sprout } from "lucide-react";

export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 text-[19px] font-semibold tracking-[-0.06em] ${
        dark ? "text-white" : "text-[#151515]"
      }`}
      aria-label="PlayGrow home"
    >
      <span className="flex size-8 items-center justify-center rounded-[11px] bg-[#151515] text-white">
        <Sprout size={18} strokeWidth={2.2} />
      </span>
      playgrow
    </Link>
  );
}
