export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL?.trim() || 'http://localhost:4000/api'
).replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiRequestOptions extends RequestInit {
  accessToken?: string;
}

export async function apiRequest<T>(
  path: string,
  { accessToken, headers, ...options }: ApiRequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  const responseText = await response.text();
  let responseBody: unknown;
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }
  }

  if (!response.ok) {
    const body = responseBody && typeof responseBody === 'object'
      ? responseBody as Record<string, unknown>
      : undefined;
    const message = body?.message ?? body?.error;
    throw new ApiError(
      typeof message === 'string' ? message : `Request failed (${response.status})`,
      response.status
    );
  }

  return responseBody as T;
}
