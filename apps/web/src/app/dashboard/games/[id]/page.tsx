"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  CircleDollarSign,
  ExternalLink,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AddGameDialog, type NewGame } from "@/components/add-game-dialog";
import { Brand } from "@/components/brand";
import { GameCover } from "@/components/game-cover";
import { usePlayGrow } from "@/context/playgrow-context";
import type { CampaignGame } from "@/types/campaign";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export default function GameAnalysisPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { ready, user, games, addGame, logOut } = usePlayGrow();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const game = games.find((item) => item.id === params.id);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  const signOut = () => {
    logOut();
    router.push("/");
  };

  const createGame = (newGame: NewGame) => {
    const id = addGame(newGame);
    setIsAddOpen(false);
    router.push(`/dashboard/games/${encodeURIComponent(id)}`);
  };

  if (!ready || !user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-[#777]">Opening your workspace…</div>;
  }

  if (!game) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f8f8f6] px-5 text-center">
        <Gamepad2 size={28} className="text-[#888]" />
        <h1 className="mt-4 text-2xl font-semibold tracking-[-0.05em]">Game not found</h1>
        <p className="mt-2 text-sm text-[#777]">This game may have been removed from this browser workspace.</p>
        <Link href="/dashboard" className="mt-5 rounded-full bg-[#151515] px-5 py-3 text-sm font-medium text-white">Back to overview</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f6]">
      <div className="flex min-h-screen">
        <GameSidebar
          games={games}
          activeGameId={game.id}
          onAddGame={() => setIsAddOpen(true)}
        />

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[#e9e9e6] bg-white/95 px-5 backdrop-blur md:px-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="rounded-lg p-2 text-[#555] hover:bg-[#f4f4f2] lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={19} />
              </button>
              <div className="hidden text-xs text-[#999] sm:block">
                <Link href="/dashboard" className="hover:text-black">Overview</Link>
                <ChevronRight size={12} className="mx-1 inline" />
                <span className="text-[#303030]">{game.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#151515] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#333]"
              >
                <Plus size={14} /> <span className="hidden sm:inline">Add a game</span><span className="sm:hidden">Add game</span>
              </button>
              <button
                onClick={signOut}
                className="flex size-9 items-center justify-center rounded-full bg-[#e9eee1] text-xs font-semibold uppercase"
                title="Log out"
              >
                {user.companyName.slice(0, 1)}
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] px-5 py-7 md:px-8 md:py-10">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs text-[#777] transition hover:text-black">
              <ArrowLeft size={14} /> Back to overview
            </Link>
            <section className="mt-6 rounded-[22px] border border-[#e9e9e6] bg-white p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="flex min-w-0 items-center gap-4">
                  <GameCover title={game.title} imageUrl={game.imageUrl} className="size-[72px] shrink-0 rounded-2xl sm:size-[88px]" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#888]">Game analysis</p>
                    <h1 className="mt-1 truncate text-[27px] font-semibold tracking-[-0.06em] sm:text-[34px]">{game.title}</h1>
                    <p className="mt-1 text-xs text-[#888]">
                      Campaign created {new Date(`${game.createdAt}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <a
                  href={game.playStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#e7e7e4] px-4 py-2.5 text-xs font-medium transition hover:bg-[#f7f7f5]"
                >
                  View Play Store page <ExternalLink size={14} />
                </a>
              </div>
              <p className="mt-6 max-w-[780px] text-sm leading-6 text-[#6f6f6c]">{game.description}</p>
            </section>

            <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
              <AnalysisMetric icon={<UsersRound size={16} />} label="Total players" value={game.players.toLocaleString("en-US")} note="Players in this campaign" />
              <AnalysisMetric icon={<UsersRound size={16} />} label="Player capacity" value={game.maxPlayers.toLocaleString("en-US")} note={`${Math.max(0, game.maxPlayers - game.players).toLocaleString("en-US")} spots remaining`} />
              <AnalysisMetric icon={<CircleDollarSign size={16} />} label="Budget spent" value={currency.format(game.spent)} note={`${spentPercentage(game)}% of total budget`} />
              <AnalysisMetric icon={<CircleDollarSign size={16} />} label="Budget remaining" value={currency.format(Math.max(0, game.budget - game.spent))} note={`From ${currency.format(game.budget)} total`} />
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <PlayerAnalysis game={game} />
              <BudgetAnalysis game={game} />
            </div>

            <section className="mt-5 rounded-[20px] border border-[#e9e9e6] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eeeeec] px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-sm font-semibold">Reward milestones</h2>
                  <p className="mt-1 text-[11px] text-[#888]">Player reward and planned budget at each level.</p>
                </div>
                <span className="rounded-full bg-[#f5f5f2] px-3 py-1.5 text-[10px] text-[#777]">{game.levels.length} levels</span>
              </div>
              {game.levels.length ? (
                <div className="divide-y divide-[#f0f0ee]">
                  {game.levels.map((level, index) => {
                    const allocation = plannedLevelBudget(game, level.reward);
                    return (
                      <div key={level.id} className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 sm:grid-cols-[44px_minmax(0,1fr)_minmax(100px,0.6fr)_100px] sm:px-6">
                        <span className="flex size-8 items-center justify-center rounded-full bg-[#f3f3f0] text-[10px] font-medium">{String(index + 1).padStart(2, "0")}</span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">{level.name}</p>
                          <p className="mt-1 text-[10px] text-[#999]">Milestone {index + 1}</p>
                        </div>
                        <div className="hidden sm:block">
                          <div className="h-1.5 overflow-hidden rounded-full bg-[#ededeb]">
                            <div className="h-full rounded-full bg-[#242424]" style={{ width: `${game.budget > 0 ? Math.min(100, (allocation / game.budget) * 100) : 0}%` }} />
                          </div>
                          <p className="mt-1 text-[9px] text-[#999]">{currency.format(allocation)} planned</p>
                        </div>
                        <span className="text-right text-xs font-semibold">{currency.format(level.reward)}<span className="mt-1 block text-[9px] font-normal text-[#999]">per player</span></span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="px-6 py-9 text-center text-xs text-[#888]">No reward levels have been added to this campaign.</p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#eeeeec] px-5 py-4 text-[10px] text-[#888] sm:px-6">
                <span>Total reward per player</span>
                <span className="font-semibold text-[#333]">{currency.format(totalReward(game))}</span>
              </div>
            </section>

            <p className="mt-5 text-[10px] text-[#aaa]">Campaign data is saved locally in this browser.</p>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/35 lg:hidden" onMouseDown={(event) => event.target === event.currentTarget && setMobileMenuOpen(false)}>
          <aside className="flex h-full w-[290px] flex-col bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <Brand />
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="rounded-lg p-2 hover:bg-[#f3f3f0]"><X size={18} /></button>
            </div>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="mt-10 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#666] hover:bg-[#f3f3f0]">
              <LayoutDashboard size={16} /> Overview
            </Link>
            <p className="mt-8 px-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#999]">Your games</p>
            <div className="mt-2 space-y-1">
              {games.map((item) => (
                <Link key={item.id} href={`/dashboard/games/${encodeURIComponent(item.id)}`} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs ${item.id === game.id ? "bg-[#f3f3f0] font-medium" : "hover:bg-[#f7f7f5]"}`}>
                  <GameCover title={item.title} imageUrl={item.imageUrl} className="size-7 shrink-0 rounded-lg" />
                  <span className="truncate">{item.title}</span>
                  <ChevronRight size={13} className="ml-auto text-[#aaa]" />
                </Link>
              ))}
            </div>
            <button onClick={() => { setIsAddOpen(true); setMobileMenuOpen(false); }} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#151515] px-4 py-2.5 text-xs font-medium text-white"><Plus size={14} /> Add a game</button>
            <button onClick={signOut} className="mt-auto inline-flex items-center gap-2 px-3 py-2 text-xs text-[#777]"><LogOut size={14} /> Log out</button>
          </aside>
        </div>
      )}

      {isAddOpen && <AddGameDialog onClose={() => setIsAddOpen(false)} onCreate={createGame} />}
    </main>
  );
}

function GameSidebar({
  games,
  activeGameId,
  onAddGame,
}: {
  games: CampaignGame[];
  activeGameId: string;
  onAddGame: () => void;
}) {
  return (
    <aside className="hidden w-[248px] shrink-0 flex-col border-r border-[#e9e9e6] bg-white px-5 py-6 lg:flex">
      <Brand />
      <div className="mt-11">
        <p className="px-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#999]">Workspace</p>
        <Link href="/dashboard" className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#666] transition hover:bg-[#f7f7f5]">
          <LayoutDashboard size={16} /> Overview
        </Link>
      </div>
      <div className="mt-8 flex items-center justify-between px-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#999]">Your games</p>
      </div>
      <div className="mt-2 space-y-1">
        {games.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/games/${encodeURIComponent(item.id)}`}
            aria-current={activeGameId === item.id ? "page" : undefined}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition ${
              activeGameId === item.id ? "bg-[#f3f3f0] font-medium text-[#171717]" : "text-[#666] hover:bg-[#f8f8f6]"
            }`}
          >
            <GameCover title={item.title} imageUrl={item.imageUrl} className="size-7 shrink-0 rounded-lg" />
            <span className="min-w-0 flex-1 truncate">{item.title}</span>
            <ChevronRight size={13} className="text-[#aaa]" />
          </Link>
        ))}
      </div>
      <button
        onClick={onAddGame}
        className="mt-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-[#686864] transition hover:bg-[#f3f3f0] hover:text-[#171717]"
      >
        <span className="flex size-7 items-center justify-center rounded-lg border border-dashed border-[#d8d8d3]">
          <Plus size={14} />
        </span>
        Add a game
      </button>
      <div className="mt-auto rounded-2xl bg-[#f7f7f4] p-4">
        <div className="flex size-8 items-center justify-center rounded-xl bg-white"><CircleDollarSign size={16} /></div>
        <p className="mt-3 text-xs font-semibold">Your next campaign</p>
        <p className="mt-1 text-[11px] leading-5 text-[#777]">Set a budget and give players a new reason to play.</p>
        <button onClick={onAddGame} className="mt-3 text-[11px] font-medium underline underline-offset-4">Add a game</button>
      </div>
    </aside>
  );
}

function PlayerAnalysis({ game }: { game: CampaignGame }) {
  const capacity = game.maxPlayers > 0 ? Math.min(100, (game.players / game.maxPlayers) * 100) : 0;
  const unfilledSpots = Math.max(0, game.maxPlayers - game.players);

  return (
    <section className="rounded-[20px] border border-[#e9e9e6] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Player analysis</h2>
          <p className="mt-1 text-[11px] text-[#888]">Campaign audience and available capacity.</p>
        </div>
        <span className="flex size-8 items-center justify-center rounded-xl bg-[#f3f3f0]"><UsersRound size={15} /></span>
      </div>
      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] text-[#888]">Players in campaign</p>
          <p className="mt-1 text-4xl font-semibold tracking-[-0.07em]">{game.players.toLocaleString("en-US")}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#888]">Calculated limit</p>
          <p className="mt-1 text-xl font-semibold tracking-[-0.05em]">{game.maxPlayers.toLocaleString("en-US")}</p>
        </div>
      </div>
      <div
        className="mt-5 h-3 overflow-hidden rounded-full bg-[#ededeb]"
        role="img"
        aria-label={`${capacity.toFixed(0)} percent of player limit reached`}
      >
        <div className="h-full rounded-full bg-[#191919] transition-all" style={{ width: `${capacity}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-[#888]">
        <span>{capacity.toFixed(0)}% of player limit reached</span>
        <span>{unfilledSpots.toLocaleString("en-US")} spots left</span>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3 border-t border-[#eeeeec] pt-5">
        <div className="rounded-xl bg-[#f8f8f6] p-3.5">
          <ArrowUpRight size={15} className="text-[#777]" />
          <p className="mt-3 text-base font-semibold">{game.maxPlayers.toLocaleString("en-US")}</p>
          <p className="mt-1 text-[10px] leading-4 text-[#888]">Maximum players funded by full reward budget</p>
        </div>
        <div className="rounded-xl bg-[#f8f8f6] p-3.5">
          <ArrowDownLeft size={15} className="text-[#777]" />
          <p className="mt-3 text-base font-semibold">{currency.format(totalReward(game))}</p>
          <p className="mt-1 text-[10px] leading-4 text-[#888]">Total possible rewards per player</p>
        </div>
      </div>
    </section>
  );
}

function BudgetAnalysis({ game }: { game: CampaignGame }) {
  const remaining = Math.max(0, game.budget - game.spent);
  const used = spentPercentage(game);
  return (
    <section className="rounded-[20px] border border-[#e9e9e6] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Budget analysis</h2>
          <p className="mt-1 text-[11px] text-[#888]">Spend so far and planned reward allocation.</p>
        </div>
        <span className="flex size-8 items-center justify-center rounded-xl bg-[#f3f3f0]"><CircleDollarSign size={15} /></span>
      </div>
      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] text-[#888]">Total campaign budget</p>
          <p className="mt-1 text-4xl font-semibold tracking-[-0.07em]">{currency.format(game.budget)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#888]">Remaining</p>
          <p className="mt-1 text-xl font-semibold tracking-[-0.05em]">{currency.format(remaining)}</p>
        </div>
      </div>
      <div
        className="mt-5 h-3 overflow-hidden rounded-full bg-[#ededeb]"
        role="img"
        aria-label={`${used}% of campaign budget used`}
      >
        <div className="h-full rounded-full bg-[#789650] transition-all" style={{ width: `${used}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-[#888]">
        <span>{currency.format(game.spent)} spent</span>
        <span>{used}% used</span>
      </div>
      <div className="mt-7 border-t border-[#eeeeec] pt-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-medium">Planned rewards by level</p>
          <p className="text-[10px] text-[#888]">{game.levels.length} levels</p>
        </div>
        {game.levels.length > 0 ? (
          <div className="space-y-3.5">
            {game.levels.map((level, index) => {
              const planned = plannedLevelBudget(game, level.reward);
              return (
                <div key={level.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-[10px]">
                    <span className="min-w-0 truncate text-[#666]">{level.name}</span>
                    <span className="shrink-0 font-medium">{currency.format(planned)}</span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-[#ededeb]"
                    role="img"
                    aria-label={`${level.name}: ${currency.format(planned)} planned`}
                  >
                    <div
                      className={`h-full rounded-full ${index % 2 === 0 ? "bg-[#242424]" : "bg-[#789650]"}`}
                      style={{ width: `${game.budget > 0 ? Math.min(100, (planned / game.budget) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[#888]">No reward levels have been added.</p>
        )}
        <p className="mt-4 text-[10px] leading-4 text-[#999]">
          Planned reward totals use the calculated player limit. Actual spend is tracked separately.
        </p>
      </div>
    </section>
  );
}

function AnalysisMetric({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#e9e9e6] bg-white p-4 md:p-5">
      <div className="text-[#666]">{icon}</div>
      <p className="mt-5 text-[11px] text-[#888]">{label}</p>
      <p className="mt-1 text-[25px] font-semibold tracking-[-0.06em] md:text-[28px]">{value}</p>
      <p className="mt-1 truncate text-[10px] text-[#999]">{note}</p>
    </div>
  );
}

function totalReward(game: CampaignGame) {
  return game.levels.reduce((total, level) => total + level.reward, 0);
}

function spentPercentage(game: CampaignGame) {
  return game.budget > 0 ? Math.min(100, Math.round((game.spent / game.budget) * 100)) : 0;
}

function plannedLevelBudget(game: CampaignGame, reward: number) {
  return Math.min(game.budget, game.maxPlayers * reward);
}
