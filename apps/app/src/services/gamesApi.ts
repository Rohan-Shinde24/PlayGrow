import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants';
import type { Game } from '@/store/slices/gamesSlice';
import { apiRequest } from './api';

type GameDocument = Record<string, unknown>;

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function asStringArray(value: unknown, fallback: string[] = []): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function asColor(value: unknown, fallback: string): string {
  return typeof value === 'string' && /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(value)
    ? value
    : fallback;
}

function asIcon(value: unknown): Game['icon'] {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(Ionicons.glyphMap, value)
    ? value as Game['icon']
    : 'game-controller-outline';
}

export function mapGameDocument(document: GameDocument): Game | null {
  const id = asString(document.id ?? document._id);
  if (!id) return null;

  return {
    id,
    title: asString(document.title ?? document.name, 'Untitled game'),
    category: asString(document.category, 'Other'),
    icon: asIcon(document.icon),
    accentColor: asColor(document.accentColor, Colors.primary),
    backgroundColor: asColor(document.backgroundColor, Colors.primaryBg),
    rating: Math.max(0, asNumber(document.rating)),
    reviews: String(document.reviews ?? '0'),
    downloads: String(document.downloads ?? '0'),
    description: asString(document.description),
    tags: asStringArray(document.tags),
    rewards: Math.max(0, asNumber(document.rewards)),
    isFeatured: document.isFeatured === true,
    isTrending: document.isTrending === true,
    isPopular: document.isPopular === true,
    sessionTime: asString(document.sessionTime, 'Varies'),
    platforms: asStringArray(document.platforms, ['Android', 'iOS']),
    requiresOnline: document.requiresOnline === true,
  };
}

export async function fetchGames(): Promise<Game[]> {
  const result = await apiRequest<unknown>('/games');
  const payload = result && typeof result === 'object' && 'data' in result
    ? (result as { data: unknown }).data
    : result;
  const documents = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && 'games' in payload
      ? (payload as { games: unknown }).games
      : [];
  if (!Array.isArray(documents)) return [];
  return documents
    .filter((item): item is GameDocument => !!item && typeof item === 'object')
    .map(mapGameDocument)
    .filter((game): game is Game => game !== null);
}
