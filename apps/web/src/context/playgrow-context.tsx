"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CampaignGame, PlayGrowUser } from "@/types/campaign";

const STORAGE_KEY = "playgrow-workspace-v1";

type WorkspaceData = {
  user: PlayGrowUser | null;
  games: CampaignGame[];
};

type PlayGrowContextValue = WorkspaceData & {
  ready: boolean;
  logIn: (email: string) => void;
  register: (user: PlayGrowUser) => void;
  logOut: () => void;
  addGame: (game: Omit<CampaignGame, "id" | "createdAt" | "players" | "spent">) => string;
};

const initialGames: CampaignGame[] = [
  {
    id: "orbit-dash",
    title: "Orbit Dash",
    imageUrl: "",
    playStoreUrl: "https://play.google.com/store",
    description: "A fast-paced space runner built for quick, replayable sessions.",
    budget: 2500,
    maxPlayers: 185,
    players: 1284,
    spent: 860,
    levels: [
      { id: "orbit-1", name: "Reach level 5", reward: 1.5 },
      { id: "orbit-2", name: "Reach level 12", reward: 4 },
      { id: "orbit-3", name: "Complete the first world", reward: 8 },
    ],
    createdAt: "2026-09-18",
  },
  {
    id: "tiny-farm",
    title: "Tiny Farm Stories",
    imageUrl: "",
    playStoreUrl: "https://play.google.com/store",
    description: "Plant, build, and grow a little farm with friends.",
    budget: 1800,
    maxPlayers: 257,
    players: 736,
    spent: 540,
    levels: [
      { id: "farm-1", name: "Build your first barn", reward: 2 },
      { id: "farm-2", name: "Reach farm level 8", reward: 5 },
    ],
    createdAt: "2026-09-06",
  },
  {
    id: "neon-rivals",
    title: "Neon Rivals",
    imageUrl: "",
    playStoreUrl: "https://play.google.com/store",
    description: "Race through a neon city and climb the leaderboard.",
    budget: 1200,
    maxPlayers: 282,
    players: 412,
    spent: 320,
    levels: [
      { id: "neon-1", name: "Finish 3 races", reward: 1.25 },
      { id: "neon-2", name: "Win your first race", reward: 3 },
    ],
    createdAt: "2026-08-24",
  },
];

const PlayGrowContext = createContext<PlayGrowContextValue | null>(null);

export function PlayGrowProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WorkspaceData>({
    user: null,
    games: initialGames,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as WorkspaceData;
        setData({
          user: parsed.user ?? null,
          games: Array.isArray(parsed.games)
            ? parsed.games.map((game) => ({
                ...game,
                maxPlayers:
                  Number.isFinite(game.maxPlayers) && game.maxPlayers >= 0
                    ? game.maxPlayers
                    : calculatePlayerLimit(game),
              }))
            : initialGames,
        });
      }
    } catch (error) {
      console.error("Unable to load the saved PlayGrow workspace.", error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("Unable to save the PlayGrow workspace.", error);
      }
    }
  }, [data, ready]);

  const logIn = useCallback((email: string) => {
    setData((current) => ({
      ...current,
      user: {
        email,
        companyName:
          current.user?.email === email
            ? current.user.companyName
            : email.split("@")[0] || "My company",
      },
    }));
  }, []);

  const register = useCallback((user: PlayGrowUser) => {
    setData((current) => ({ ...current, user }));
  }, []);

  const logOut = useCallback(() => {
    setData((current) => ({ ...current, user: null }));
  }, []);

  const addGame = useCallback(
    (game: Omit<CampaignGame, "id" | "createdAt" | "players" | "spent">) => {
      const id = crypto.randomUUID();
      setData((current) => ({
        ...current,
        games: [
          {
            ...game,
            id,
            createdAt: new Date().toISOString().slice(0, 10),
            players: 0,
            spent: 0,
          },
          ...current.games,
        ],
      }));
      return id;
    },
    [],
  );

  const value = useMemo(
    () => ({ ...data, ready, logIn, register, logOut, addGame }),
    [data, ready, logIn, register, logOut, addGame],
  );

  return <PlayGrowContext.Provider value={value}>{children}</PlayGrowContext.Provider>;
}

function calculatePlayerLimit(game: CampaignGame) {
  const rewardPerPlayer = game.levels.reduce(
    (total, level) => total + (Number.isFinite(level.reward) ? level.reward : 0),
    0,
  );
  return game.budget > 0 && rewardPerPlayer > 0
    ? Math.floor(game.budget / rewardPerPlayer)
    : 0;
}

export function usePlayGrow() {
  const context = useContext(PlayGrowContext);
  if (!context) {
    throw new Error("usePlayGrow must be used inside PlayGrowProvider.");
  }
  return context;
}
