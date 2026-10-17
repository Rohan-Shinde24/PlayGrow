import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { apiRequest, ApiError } from './api';

export type UserRole = 'player' | 'company' | 'admin';

export interface AuthUser {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  username?: string;
  email: string;
  role: UserRole;
  [key: string]: unknown;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const SESSION_KEY = 'playgrow.auth.session';
let memorySession: AuthSession | null = null;
let refreshInFlight: Promise<AuthSession | null> | null = null;

async function readStoredSession(): Promise<AuthSession | null> {
  try {
    const value = Platform.OS === 'web'
      ? (typeof localStorage === 'undefined' ? null : localStorage.getItem(SESSION_KEY))
      : await SecureStore.getItemAsync(SESSION_KEY);
    memorySession = value ? JSON.parse(value) as AuthSession : null;
  } catch {
    return memorySession;
  }
  return memorySession;
}

async function writeStoredSession(session: AuthSession): Promise<void> {
  memorySession = session;
  const value = JSON.stringify(session);
  try {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.setItem(SESSION_KEY, value);
    } else {
      await SecureStore.setItemAsync(SESSION_KEY, value);
    }
  } catch {
    // Keep the session available in memory if the platform store is unavailable.
  }
}

async function clearStoredSession(): Promise<void> {
  memorySession = null;
  try {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_KEY);
    } else {
      await SecureStore.deleteItemAsync(SESSION_KEY);
    }
  } catch {
    // Clearing the in-memory copy is sufficient when platform storage is unavailable.
  }
}

function unwrapPayload(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object') return {};
  const payload = value as Record<string, unknown>;
  const data = payload.data;
  return data && typeof data === 'object' ? data as Record<string, unknown> : payload;
}

function parseSession(value: unknown): AuthSession {
  const payload = unwrapPayload(value);
  const tokens = payload.tokens && typeof payload.tokens === 'object'
    ? payload.tokens as Record<string, unknown>
    : payload;
  const rawUser = tokens.user ?? payload.user;
  if (!rawUser || typeof rawUser !== 'object') {
    throw new Error('The server response did not include a user profile.');
  }

  const userData = rawUser as Record<string, unknown>;
  const id = userData.id ?? userData._id;
  const email = userData.email;
  const accessToken = tokens.accessToken;
  const refreshToken = tokens.refreshToken;
  if (
    typeof id !== 'string'
    || typeof email !== 'string'
    || typeof accessToken !== 'string'
    || typeof refreshToken !== 'string'
  ) {
    throw new Error('The server returned an incomplete authentication response.');
  }

  const role = userData.role;
  return {
    accessToken,
    refreshToken,
    user: {
      ...userData,
      id,
      email,
      role: role === 'company' || role === 'admin' ? role : 'player',
    } as AuthUser,
  };
}

async function authenticate(path: string, credentials: object): Promise<AuthSession> {
  const session = parseSession(await apiRequest<unknown>(path, {
    method: 'POST',
    body: JSON.stringify(credentials),
  }));
  await writeStoredSession(session);
  return session;
}

export function register(credentials: RegisterCredentials): Promise<AuthSession> {
  return authenticate('/auth/register', { ...credentials, role: 'player' });
}

export function login(email: string, password: string): Promise<AuthSession> {
  return authenticate('/auth/login', { email, password });
}

export async function getStoredSession(): Promise<AuthSession | null> {
  return readStoredSession();
}

export async function refreshSession(): Promise<AuthSession | null> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const current = await readStoredSession();
    if (!current?.refreshToken) return null;
    try {
      const session = parseSession(await apiRequest<unknown>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: current.refreshToken }),
      }));
      await writeStoredSession(session);
      return session;
    } catch {
      await clearStoredSession();
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

export async function authenticatedRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await readStoredSession();
  if (!session) throw new ApiError('Please sign in to continue.', 401);

  try {
    return await apiRequest<T>(path, { ...options, accessToken: session.accessToken });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    const refreshed = await refreshSession();
    if (!refreshed) throw error;
    return apiRequest<T>(path, { ...options, accessToken: refreshed.accessToken });
  }
}

export async function logoutSession(): Promise<void> {
  const session = await readStoredSession();
  try {
    if (session?.refreshToken) {
      await apiRequest('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      });
    }
  } finally {
    await clearStoredSession();
  }
}

export function profileFromAuthUser(user: AuthUser) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return {
    id: user.id,
    name: user.name || fullName || user.username || user.email,
    username: user.username || user.firstName || user.email.split('@')[0],
    email: user.email,
    role: user.role,
    isLoggedIn: true,
  };
}
