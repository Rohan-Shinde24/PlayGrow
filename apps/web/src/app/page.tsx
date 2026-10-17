import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  Gamepad2,
  MoveUpRight,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { SiteHeader } from "@/components/site-header";

const steps = [
  {
    number: "01",
    title: "Add your game",
    text: "Bring your game page, set a campaign budget, and tell players what to do.",
  },
  {
    number: "02",
    title: "Set your rewards",
    text: "Create simple in-game milestones and choose a reward for each level.",
  },
  {
    number: "03",
    title: "Grow together",
    text: "Follow player progress and your remaining budget from one clear dashboard.",
  },
];

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <section className="relative overflow-hidden px-5 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-[1.03fr_0.97fr]">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e7e7e4] px-3 py-1.5 text-xs font-medium text-[#555]">
              <span className="size-1.5 rounded-full bg-[#91c847]" />
              A better way to grow your game
            </div>
            <h1 className="max-w-[650px] text-[52px] font-semibold leading-[0.99] tracking-[-0.075em] sm:text-[68px] md:text-[76px]">
              Make every
              <br />
              player <span className="font-serif font-normal italic">count.</span>
            </h1>
            <p className="mt-7 max-w-[510px] text-[17px] leading-7 text-[#6c6c69]">
              Turn great games into growing communities. Launch player campaigns,
              reward real progress, and keep every budget in view.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 rounded-full bg-[#151515] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#333]"
              >
                Start your first campaign <ArrowUpRight size={16} />
              </Link>
              <a href="#how-it-works" className="rounded-full px-5 py-3.5 text-sm font-medium text-[#525252] hover:text-black">
                See how it works
              </a>
            </div>
            <div className="mt-11 flex items-center gap-3 text-xs text-[#777]">
              <span className="flex -space-x-2">
                {["#d8e9cb", "#f0dbcd", "#e3ddf2", "#d8e4ed"].map((color, index) => (
                  <span
                    key={color}
                    className="flex size-7 items-center justify-center rounded-full border-2 border-white text-[9px] font-semibold text-[#343434]"
                    style={{ backgroundColor: color }}
                  >
                    {["A", "J", "M", "R"][index]}
                  </span>
                ))}
              </span>
              Built for the people who make games
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
            <div className="absolute -right-10 -top-8 size-44 rounded-full bg-[#eff5e8] blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-[#e9e9e6] bg-[#f8f8f6] p-5 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.3)] sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Brand />
                  <span className="hidden text-xs text-[#aaa] sm:inline">/</span>
                  <span className="hidden text-xs text-[#777] sm:inline">Workspace</span>
                </div>
                <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-[#5e5e5e]">Last 30 days⌄</span>
              </div>
              <div className="mt-8">
                <p className="text-xs text-[#777]">Campaign overview</p>
                <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.05em]">Your games, growing.</h2>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2.5">
                {[
                  { icon: Gamepad2, label: "Active games", value: "08" },
                  { icon: UsersRound, label: "Total players", value: "12.8k" },
                  { icon: CircleDollarSign, label: "Budget left", value: "$4.2k" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-[16px] border border-[#ececea] bg-white p-3 sm:p-4">
                    <Icon size={16} className="text-[#686868]" />
                    <p className="mt-4 text-[9px] text-[#888] sm:text-[10px]">{label}</p>
                    <p className="mt-1 text-base font-semibold tracking-[-0.05em] sm:text-xl">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-[18px] border border-[#ececea] bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Campaign performance</p>
                    <p className="mt-1 text-[10px] text-[#8a8a8a]">Players this month</p>
                  </div>
                  <span className="rounded-full bg-[#f1f7e9] px-2.5 py-1 text-[10px] font-medium text-[#526f34]">+18.6%</span>
                </div>
                <div className="mt-6 flex h-[100px] items-end gap-2 border-b border-[#f0f0ee] pb-2">
                  {[28, 42, 35, 54, 48, 72, 61, 88, 68, 96, 78, 100].map((height, index) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-t-[5px] ${index === 11 ? "bg-[#171717]" : "bg-[#e6e6e3]"}`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[9px] text-[#999]">
                  <span>01 Oct</span><span>07 Oct</span><span>14 Oct</span><span>Today</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-[16px] border border-[#ececea] bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-[#f0f3e9] text-lg">🚀</div>
                  <div><p className="text-xs font-semibold">Orbit Dash</p><p className="mt-1 text-[10px] text-[#888]">1,284 players · 3 levels</p></div>
                </div>
                <div className="text-right"><p className="text-xs font-semibold">$1,640</p><p className="mt-1 text-[10px] text-[#888]">remaining</p></div>
              </div>
              <div className="absolute -bottom-4 -left-5 flex items-center gap-3 rounded-2xl border border-[#e9e9e6] bg-white p-3.5 shadow-xl sm:-left-9">
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#edf5e3]"><Sparkles size={17} /></span>
                <div><p className="text-[11px] font-semibold">Milestone reached</p><p className="mt-1 text-[10px] text-[#888]">A player just hit level 12</p></div>
                <Check size={16} className="ml-2 text-[#67913e]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#ececea] bg-[#fafaf8] px-5 py-6">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8a8a87]">Everything you need to build momentum</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-[#5c5c59] sm:gap-10">
            <span className="inline-flex items-center gap-2"><Check size={14} /> Simple campaign setup</span>
            <span className="inline-flex items-center gap-2"><Check size={14} /> Player-first rewards</span>
            <span className="inline-flex items-center gap-2"><Check size={14} /> Clear budget tracking</span>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#858581]">How it works</p>
              <h2 className="mt-5 max-w-[450px] text-4xl font-semibold leading-[1.06] tracking-[-0.065em] md:text-[54px]">
                Good games deserve to be found.
              </h2>
            </div>
            <div className="grid divide-y divide-[#e9e9e6] border-t border-[#e9e9e6]">
              {steps.map((step) => (
                <div key={step.number} className="grid gap-3 py-6 sm:grid-cols-[70px_1fr_1fr] sm:items-start">
                  <span className="text-xs text-[#9a9a96]">{step.number}</span>
                  <h3 className="text-base font-semibold tracking-[-0.03em]">{step.title}</h3>
                  <p className="max-w-[310px] text-sm leading-6 text-[#777]">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="why-playgrow" className="bg-[#161616] px-5 py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#a6a6a1]">Built for game makers</p>
            <h2 className="mt-5 max-w-[540px] text-4xl font-semibold leading-[1.08] tracking-[-0.065em] md:text-[56px]">
              Less guesswork.
              <br />More <span className="font-serif font-normal italic">game time.</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { number: "01", title: "Clarity by default", text: "See players, rewards, and remaining spend without digging." },
              { number: "02", title: "Rewards that click", text: "Give players a reason to explore every part of your game." },
              { number: "03", title: "Your data, your call", text: "Your campaign workspace stays in your browser." },
              { number: "04", title: "Ready when you are", text: "Start with one game, then grow at your own pace." },
            ].map((item) => (
              <div key={item.number} className="min-h-[150px] rounded-2xl border border-white/15 p-4 sm:p-5">
                <p className="text-[10px] text-[#aaa]">{item.number}</p>
                <h3 className="mt-6 text-sm font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#aaa]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#858581]">A few answers</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em]">Good to know.</h2>
          </div>
          <div className="divide-y divide-[#e9e9e6] border-t border-[#e9e9e6]">
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">Is PlayGrow connected to a backend? <ArrowDown size={15} className="transition group-open:rotate-180" /></summary>
              <p className="mt-3 max-w-[480px] text-sm leading-6 text-[#777]">This starter experience is frontend-only. Your sign-in state and campaign data are stored locally in your browser; no account or campaign data is sent to a server.</p>
            </details>
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">Can I create custom reward levels? <ArrowDown size={15} className="transition group-open:rotate-180" /></summary>
              <p className="mt-3 max-w-[480px] text-sm leading-6 text-[#777]">Yes. Add any number of milestones to a game and set a reward amount for each one when you create a campaign.</p>
            </details>
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">How do I get started? <ArrowDown size={15} className="transition group-open:rotate-180" /></summary>
              <p className="mt-3 max-w-[480px] text-sm leading-6 text-[#777]">Create your local workspace, add your first game, set its budget, and start shaping your player campaign.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-7 rounded-[28px] bg-[#f3f3ef] p-7 sm:flex-row sm:items-center sm:p-12">
          <div><p className="text-xs font-medium uppercase tracking-[0.15em] text-[#777]">Your next player is out there</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] sm:text-[42px]">Ready to grow your game?</h2></div>
          <Link href="/register" className="inline-flex items-center gap-3 rounded-full bg-[#151515] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#333]">Start a campaign <MoveUpRight size={16} /></Link>
        </div>
      </section>

      <footer className="border-t border-[#ececea] px-5">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 py-7 sm:flex-row sm:items-center">
          <Brand />
          <p className="text-xs text-[#888]">A calmer way to grow games. © 2026 PlayGrow.</p>
          <Link href="/login" className="inline-flex items-center gap-1 text-xs text-[#555] hover:text-black">Open your workspace <ArrowRight size={13} /></Link>
        </div>
      </footer>
    </main>
  );
}
