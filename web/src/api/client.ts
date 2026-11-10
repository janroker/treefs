import type { ApiErrorBody, RequestOptions } from './api.types';

export const ITEMS_URL = '/api/v1/items';

class ApiError extends Error {
  override readonly name = 'ApiError';

  readonly body: ApiErrorBody;

  constructor(body: ApiErrorBody) {
    const fieldMessages = body.errors?.map((error) => error.message) ?? [];
    super(fieldMessages.length > 0 ? fieldMessages.join(' ') : body.message);
    this.body = body;
  }
}

function unknownError(statusCode: number): ApiErrorBody {
  return {
    code: 'http.unknown',
    message: `The server answered ${String(statusCode)}. Try again.`,
    statusCode,
    correlationId: '',
  };
}

async function readError(response: Response): Promise<ApiErrorBody> {
  try {
    return (await response.json()) as ApiErrorBody;
  } catch {
    return unknownError(response.status);
  }
}

function urlOf(path: string, query: RequestOptions['query'] = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }
  const search = params.toString();
  return search === '' ? path : `${path}?${search}`;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', query, body, signal } = options;
  const response = await fetch(urlOf(path, query), {
    method,
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? null : JSON.stringify(body),
    signal: signal ?? null,
  });
  if (!response.ok) {
    throw new ApiError(await readError(response));
  }
  return (response.status === 204 ? undefined : await response.json()) as T;
}
