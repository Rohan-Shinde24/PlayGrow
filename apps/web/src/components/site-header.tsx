import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/brand";

export function SiteHeader() {
  return (
    <header className="border-b border-[#ececea]">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-5 md:px-8">
        <Brand />
        <nav className="hidden items-center gap-9 text-sm text-[#646464] md:flex">
          <a href="#how-it-works" className="transition hover:text-black">How it works</a>
          <a href="#why-playgrow" className="transition hover:text-black">Why PlayGrow</a>
          <a href="#faq" className="transition hover:text-black">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden px-3 py-2 text-sm font-medium hover:text-[#686868] sm:block">
            Log in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-[#151515] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#333]"
          >
            Start a campaign <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}
