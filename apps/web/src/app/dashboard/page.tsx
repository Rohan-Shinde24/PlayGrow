"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
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
import { useEffect, useMemo, useState } from "react";
import { AddGameDialog, type NewGame } from "@/components/add-game-dialog";
import { Brand } from "@/components/brand";
import { GameCover } from "@/components/game-cover";
import { usePlayGrow } from "@/context/playgrow-context";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function DashboardPage() {
  const router = useRouter();
  const { ready, user, games, addGame, logOut } = usePlayGrow();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  const totalPlayers = useMemo(() => games.reduce((total, game) => total + game.players, 0), [games]);
  const totalBudget = useMemo(() => games.reduce((total, game) => total + game.budget, 0), [games]);
  const remainingBudget = useMemo(
    () => games.reduce((total, game) => total + Math.max(0, game.budget - game.spent), 0),
    [games],
  );
  const filteredGames = useMemo(
    () => games.filter((game) => game.title.toLowerCase().includes(search.trim().toLowerCase())),
    [games, search],
  );
  const selectedGame = games.find((game) => game.id === selectedId) ?? filteredGames[0] ?? games[0] ?? null;

  if (!ready || !user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-[#777]">Opening your workspace…</div>;
  }

  const createGame = (game: NewGame) => {
    const id = addGame(game);
    setSelectedId(id);
    setIsAddOpen(false);
  };

  const signOut = () => {
    logOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#f8f8f6]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-[#e9e9e6] bg-white px-5 py-6 lg:flex">
          <Brand />
          <div className="mt-11">
            <p className="px-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#999]">Workspace</p>
            <button className="mt-3 flex w-full items-center gap-3 rounded-xl bg-[#f3f3f0] px-3 py-2.5 text-left text-sm font-medium">
              <LayoutDashboard size={16} /> Overview
            </button>
          </div>
          <div className="mt-8 flex items-center justify-between px-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#999]">Your games</p>
          </div>
          <div className="mt-2 space-y-1">
            {games.map((game) => (
                <Link
                  href={`/dashboard/games/${encodeURIComponent(game.id)}`}
                  key={game.id}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition ${
                  selectedGame?.id === game.id ? "bg-[#f3f3f0] font-medium text-[#171717]" : "text-[#666] hover:bg-[#f8f8f6]"
                }`}
              >
                <GameCover title={game.title} imageUrl={game.imageUrl} className="size-7 shrink-0 rounded-lg" />
                <span className="min-w-0 flex-1 truncate">{game.title}</span>
                <ChevronRight size={13} className="text-[#aaa]" />
              </Link>
            ))}
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
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
            <button onClick={() => setIsAddOpen(true)} className="mt-3 text-[11px] font-medium underline underline-offset-4">Add a game</button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[#e9e9e6] bg-white/95 px-5 backdrop-blur md:px-8">
            <button onClick={() => setMobileMenuOpen(true)} className="rounded-lg p-2 text-[#555] hover:bg-[#f4f4f2] lg:hidden" aria-label="Open menu"><Menu size={19} /></button>
            <div className="hidden text-xs text-[#999] sm:block">Workspace <ChevronRight size={12} className="mx-1 inline" /> <span className="text-[#303030]">Overview</span></div>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsAddOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-[#151515] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#333]">
                <Plus size={14} /> <span className="hidden sm:inline">Add a game</span><span className="sm:hidden">Add game</span>
              </button>
              <button onClick={signOut} className="flex size-9 items-center justify-center rounded-full bg-[#e9eee1] text-xs font-semibold uppercase" title="Log out">
                {user.companyName.slice(0, 1)}
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs text-[#888]">{user.companyName} workspace</p>
                <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.065em] md:text-[38px]">Good morning, {user.companyName}.</h1>
                <p className="mt-2 text-sm text-[#777]">Here’s how your games are doing.</p>
              </div>
              <label className="flex w-full items-center gap-2 rounded-xl border border-[#e8e8e5] bg-white px-3 py-2.5 sm:w-[230px]">
                <span className="text-[#999]"><SearchIcon /></span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a game..." className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#aaa]" />
                <span className="text-[10px] text-[#aaa]">⌘ K</span>
              </label>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              <MetricCard icon={<Gamepad2 size={16} />} label="Total games" value={games.length.toString().padStart(2, "0")} note="In your workspace" />
              <MetricCard icon={<UsersRound size={16} />} label="Total players" value={totalPlayers.toLocaleString("en-US")} note="Across all campaigns" trend="+12.8%" />
              <MetricCard icon={<UsersRound size={16} />} label="Player limit" value={games.reduce((total, game) => total + game.maxPlayers, 0).toLocaleString("en-US")} note="Based on reward budgets" />
              <MetricCard icon={<CircleDollarSign size={16} />} label="Total budget" value={currency.format(totalBudget)} note="Campaign allocation" />
              <MetricCard icon={<ArrowDownRight size={16} />} label="Budget remaining" value={currency.format(remainingBudget)} note={`${currency.format(totalBudget - remainingBudget)} spent so far`} />
            </div>

            <section className="mt-8 grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
              <div className="rounded-[20px] border border-[#e9e9e6] bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eeeeec] px-5 py-4 md:px-6">
                  <div><h2 className="text-sm font-semibold">Your games</h2><p className="mt-1 text-[11px] text-[#888]">Select a game to view its campaign details.</p></div>
                  <button onClick={() => setIsAddOpen(true)} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#555] hover:text-black"><Plus size={14} /> Add game</button>
                </div>
                <div className="hidden grid-cols-[minmax(150px,1.5fr)_0.8fr_0.9fr_0.9fr_20px] gap-3 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.1em] text-[#999] sm:grid">
                  <span>Game</span><span>Players</span><span>Budget</span><span>Remaining</span><span />
                </div>
                <div className="divide-y divide-[#f0f0ee]">
                  {filteredGames.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-[#888]">No games match “{search}”.</div>
                  ) : filteredGames.map((game) => {
                    const isSelected = selectedGame?.id === game.id;
                    const left = Math.max(0, game.budget - game.spent);
                    const percentSpent = game.budget > 0 ? Math.min(100, (game.spent / game.budget) * 100) : 0;
                    return (
                      <button
                        key={game.id}
                        onClick={() => setSelectedId(game.id)}
                        className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 text-left transition sm:grid-cols-[minmax(150px,1.5fr)_0.8fr_0.9fr_0.9fr_20px] sm:px-6 ${
                          isSelected ? "bg-[#fbfbf9]" : "hover:bg-[#fcfcfb]"
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <GameCover title={game.title} imageUrl={game.imageUrl} className="size-10 shrink-0 rounded-xl" />
                          <span className="min-w-0"><span className="block truncate text-xs font-medium">{game.title}</span><span className="mt-1 block truncate text-[10px] text-[#999]">{game.levels.length} reward levels</span></span>
                        </span>
                        <span className="text-xs font-medium">{game.players.toLocaleString("en-US")}<span className="mt-1 block text-[10px] font-normal text-[#999]">{game.maxPlayers.toLocaleString("en-US")} player limit</span></span>
                        <span className="hidden text-xs text-[#555] sm:block">{currency.format(game.budget)}</span>
                        <span className="hidden text-xs font-medium sm:block">{currency.format(left)}<span className="mt-1 block h-1 w-full overflow-hidden rounded-full bg-[#ededeb]"><span className="block h-full rounded-full bg-[#242424]" style={{ width: `${100 - percentSpent}%` }} /></span></span>
                        <ChevronRight size={15} className="text-[#aaa]" />
                      </button>
                    );
                  })}
                </div>
                {games.length === 0 && (
                  <div className="px-6 py-10 text-center">
                    <Gamepad2 size={24} className="mx-auto text-[#888]" />
                    <p className="mt-3 text-sm font-medium">Your first game starts here</p>
                    <p className="mt-1 text-xs text-[#888]">Add a game to create its first campaign.</p>
                    <button onClick={() => setIsAddOpen(true)} className="mt-4 rounded-full bg-[#151515] px-4 py-2 text-xs font-medium text-white">Add a game</button>
                  </div>
                )}
              </div>

              <div className="rounded-[20px] border border-[#e9e9e6] bg-white">
                {selectedGame ? (
                  <>
                    <div className="flex items-center justify-between border-b border-[#eeeeec] px-5 py-4">
                      <div><h2 className="text-sm font-semibold">Campaign details</h2><p className="mt-1 text-[11px] text-[#888]">A closer look at this game.</p></div>
                      <span className="rounded-full bg-[#f1f6e9] px-2.5 py-1 text-[10px] font-medium text-[#536c39]">Active</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3">
                        <GameCover title={selectedGame.title} imageUrl={selectedGame.imageUrl} className="size-14 shrink-0 rounded-2xl" />
                        <div className="min-w-0 flex-1"><h3 className="truncate text-base font-semibold tracking-[-0.04em]">{selectedGame.title}</h3><p className="mt-1 text-[11px] text-[#888]">Created {new Date(`${selectedGame.createdAt}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></div>
                        <a href={selectedGame.playStoreUrl} target="_blank" rel="noreferrer" aria-label="Open Play Store page" className="rounded-lg border border-[#e9e9e6] p-2 text-[#666] hover:bg-[#f7f7f5]"><ExternalLink size={14} /></a>
                      </div>
                      <p className="mt-4 text-xs leading-5 text-[#777]">{selectedGame.description}</p>
                      <div className="mt-5 rounded-2xl bg-[#f7f7f5] p-4">
                        <div className="flex items-end justify-between">
                          <div><p className="text-[10px] text-[#888]">Budget remaining</p><p className="mt-1 text-[25px] font-semibold tracking-[-0.06em]">{currency.format(Math.max(0, selectedGame.budget - selectedGame.spent))}</p></div>
                          <p className="text-[10px] text-[#888]">of {currency.format(selectedGame.budget)}</p>
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e5e5e2]"><div className="h-full rounded-full bg-[#191919]" style={{ width: `${selectedGame.budget > 0 ? Math.min(100, (selectedGame.spent / selectedGame.budget) * 100) : 0}%` }} /></div>
                        <div className="mt-2 flex justify-between text-[10px] text-[#888]"><span>{currency.format(selectedGame.spent)} spent</span><span>{selectedGame.budget > 0 ? Math.round((selectedGame.spent / selectedGame.budget) * 100) : 0}% used</span></div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2.5">
                        <div className="rounded-xl border border-[#ededeb] p-3"><UsersRound size={14} className="text-[#777]" /><p className="mt-3 text-lg font-semibold tracking-[-0.04em]">{selectedGame.players.toLocaleString("en-US")}</p><p className="mt-0.5 text-[10px] text-[#888]">Players · limit {selectedGame.maxPlayers.toLocaleString("en-US")}</p></div>
                        <div className="rounded-xl border border-[#ededeb] p-3"><Gamepad2 size={14} className="text-[#777]" /><p className="mt-3 text-lg font-semibold tracking-[-0.04em]">{selectedGame.levels.length}</p><p className="mt-0.5 text-[10px] text-[#888]">Reward levels</p></div>
                      </div>
                      <div className="mt-6">
                        <div className="flex items-center justify-between"><h3 className="text-xs font-semibold">Reward levels</h3><span className="text-[10px] text-[#888]">{selectedGame.levels.length} milestones</span></div>
                        {selectedGame.levels.length ? (
                          <div className="mt-2 divide-y divide-[#f0f0ee]">
                            {selectedGame.levels.map((level, index) => (
                              <div key={level.id} className="flex items-center gap-3 py-3">
                                <span className="flex size-7 items-center justify-center rounded-full bg-[#f3f3f0] text-[10px] font-medium">{String(index + 1).padStart(2, "0")}</span>
                                <span className="min-w-0 flex-1 truncate text-xs text-[#555]">{level.name}</span>
                                <span className="text-xs font-medium">{currency.format(level.reward)}</span>
                              </div>
                            ))}
                          </div>
                        ) : <p className="mt-3 text-xs text-[#888]">No levels added.</p>}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
                    <Gamepad2 size={26} className="text-[#888]" />
                    <p className="mt-3 text-sm font-medium">No game selected</p>
                    <p className="mt-1 text-xs text-[#888]">Add a game to see its campaign details here.</p>
                    <button onClick={() => setIsAddOpen(true)} className="mt-4 rounded-full bg-[#151515] px-4 py-2 text-xs font-medium text-white">Add a game</button>
                  </div>
                )}
              </div>
            </section>
            <p className="mt-6 text-[10px] text-[#aaa]">Demo workspace · all data is stored locally in this browser.</p>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/35 lg:hidden" onMouseDown={(event) => event.target === event.currentTarget && setMobileMenuOpen(false)}>
          <aside className="flex h-full w-[290px] flex-col bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between"><Brand /><button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="rounded-lg p-2 hover:bg-[#f3f3f0]"><X size={18} /></button></div>
            <p className="mt-10 px-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#999]">Workspace</p>
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f3f3f0] px-3 py-2.5 text-sm font-medium"><LayoutDashboard size={16} /> Overview</div>
            <p className="mt-8 px-3 text-[10px] font-medium uppercase tracking-[0.15em] text-[#999]">Your games</p>
            <div className="mt-2 space-y-1">{games.map((game) => <Link key={game.id} href={`/dashboard/games/${encodeURIComponent(game.id)}`} onClick={() => setMobileMenuOpen(false)} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs hover:bg-[#f7f7f5]"><GameCover title={game.title} imageUrl={game.imageUrl} className="size-7 rounded-lg" /><span className="truncate">{game.title}</span><ChevronRight size={13} className="ml-auto text-[#aaa]" /></Link>)}</div>
            <button onClick={() => { setIsAddOpen(true); setMobileMenuOpen(false); }} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#151515] px-4 py-2.5 text-xs font-medium text-white"><Plus size={14} /> Add a game</button>
            <button onClick={signOut} className="mt-auto inline-flex items-center gap-2 px-3 py-2 text-xs text-[#777]"><LogOut size={14} /> Log out</button>
          </aside>
        </div>
      )}
      {isAddOpen && <AddGameDialog onClose={() => setIsAddOpen(false)} onCreate={createGame} />}
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  note,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  trend?: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#e9e9e6] bg-white p-4 md:p-5">
      <div className="flex items-center justify-between text-[#666]">{icon}{trend && <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#698346]"><ArrowUpRight size={12} /> {trend}</span>}</div>
      <p className="mt-5 text-[11px] text-[#888]">{label}</p>
      <p className="mt-1 text-[25px] font-semibold tracking-[-0.06em] md:text-[28px]">{value}</p>
      <p className="mt-1 truncate text-[10px] text-[#999]">{note}</p>
    </div>
  );
}


function SearchIcon() {
  return <span aria-hidden="true" className="block size-3.5 rounded-full border-[1.5px] border-current after:relative after:left-[9px] after:top-[7px] after:block after:h-[5px] after:w-[1.5px] after:rotate-[-45deg] after:bg-current" />;
}
