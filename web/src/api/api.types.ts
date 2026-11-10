import type {
  CreateItemBody,
  CreateItemResponse,
  ErrorResponse,
  GetItemResponse,
  ListItemsResponse,
} from './generated/apps/api/src/types';

export type FolderId = string | null;

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'DELETE';
  query?: Record<string, string | number | undefined>;
  body?: unknown;
  signal?: AbortSignal;
};

export type NewItem = CreateItemBody;
export type Item = CreateItemResponse;
export type ItemDetail = GetItemResponse;
export type ItemPage = ListItemsResponse;
export type ApiErrorBody = ErrorResponse;
export type ItemType = CreateItemBody['type'];
