import {
  type InfiniteData,
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type UseInfiniteQueryResult,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import type {
  FolderId,
  Item,
  ItemDetail,
  ItemPage,
  NewItem,
  SearchParams,
} from './api.types';
import { apiRequest, ITEMS_URL } from './client';

const ROOT = 'root';
const PAGE_SIZE = 50;

const itemKeys = {
  all: ['items'] as const,
  folder: (folderId: FolderId) =>
    ['items', 'folder', folderId ?? ROOT] as const,
  detail: (id: string) => ['items', 'detail', id] as const,
};

export function useFolderItems(
  folderId: FolderId,
): UseInfiniteQueryResult<InfiniteData<ItemPage>> {
  return useInfiniteQuery({
    queryKey: itemKeys.folder(folderId),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      apiRequest<ItemPage>(ITEMS_URL, {
        query: {
          parentId: folderId ?? ROOT,
          limit: PAGE_SIZE,
          cursor: pageParam,
        },
        signal,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useItemDetail(id: FolderId): UseQueryResult<ItemDetail> {
  return useQuery({
    queryKey: itemKeys.detail(id ?? ROOT),
    queryFn: ({ signal }) =>
      apiRequest<ItemDetail>(`${ITEMS_URL}/${id ?? ''}`, { signal }),
    enabled: id !== null,
  });
}

export function useSearch(
  params: SearchParams,
  enabled: boolean,
): UseQueryResult<ItemPage> {
  return useQuery({
    queryKey: ['items', 'search', params],
    queryFn: ({ signal }) =>
      apiRequest<ItemPage>(ITEMS_URL, {
        query: { q: params.q, match: params.match, type: params.type },
        signal,
      }),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useCreateItem(): UseMutationResult<Item, Error, NewItem> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: NewItem) =>
      apiRequest<Item>(ITEMS_URL, { method: 'POST', body }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemKeys.all }),
  });
}

export function useDeleteItem(): UseMutationResult<undefined, Error, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest<undefined>(`${ITEMS_URL}/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemKeys.all }),
  });
}
