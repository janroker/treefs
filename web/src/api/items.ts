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
import { withItem, withoutItem } from './items-cache';

const ROOT = 'root';
const PAGE_SIZE = 50;

const itemKeys = {
  folders: ['items', 'folder'] as const,
  searches: ['items', 'search'] as const,
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
): UseInfiniteQueryResult<InfiniteData<ItemPage>> {
  return useInfiniteQuery({
    queryKey: [...itemKeys.searches, params],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      apiRequest<ItemPage>(ITEMS_URL, {
        query: {
          q: params.q,
          match: params.match,
          type: params.type,
          parentId: params.parentId,
          cursor: pageParam,
        },
        signal,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useCreateItem(): UseMutationResult<Item, Error, NewItem> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: NewItem) =>
      apiRequest<Item>(ITEMS_URL, { method: 'POST', body }),
    onSuccess: async (created) => {
      queryClient.setQueryData<InfiniteData<ItemPage>>(
        itemKeys.folder(created.parentId),
        (data) => (data === undefined ? data : withItem(data, created)),
      );
      await queryClient.invalidateQueries({ queryKey: itemKeys.searches });
    },
  });
}

export function useDeleteItem(
  onDeleted: () => void,
): UseMutationResult<undefined, Error, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest<undefined>(`${ITEMS_URL}/${id}`, { method: 'DELETE' }),
    onSuccess: async (_, id) => {
      queryClient.setQueriesData<InfiniteData<ItemPage>>(
        { queryKey: itemKeys.folders },
        (data) => (data === undefined ? data : withoutItem(data, id)),
      );
      queryClient.removeQueries({ queryKey: itemKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: itemKeys.searches });
      onDeleted();
    },
  });
}
