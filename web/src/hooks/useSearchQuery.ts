import { useSearch } from '../api/items';
import type { FolderId, MatchMode } from '../api/api.types';
import type { SearchForm, SearchQuery } from './hooks.types';
import { useDebouncedValue } from './useDebouncedValue';

const DEBOUNCE_MS = 150;

function isSearchActive(
  match: MatchMode,
  focused: boolean,
  q: string,
): boolean {
  if (match === 'prefix') {
    return focused || q !== '';
  }
  return q !== '';
}

function parentIdOf(form: SearchForm, folderId: FolderId): FolderId {
  return form.scope === 'folder' ? folderId : null;
}

export function useSearchQuery(
  form: SearchForm,
  folderId: FolderId,
): SearchQuery {
  const q = useDebouncedValue(form.text, DEBOUNCE_MS);
  const enabled = isSearchActive(form.match, form.focused, q);
  const parentId = parentIdOf(form, folderId);
  const result = useSearch(
    {
      q,
      match: form.match,
      type: form.typeFilter === 'both' ? undefined : form.typeFilter,
      parentId: parentId ?? undefined,
    },
    enabled,
  );
  return {
    query: q,
    items: result.data?.items ?? [],
    open: form.focused && enabled && result.data !== undefined,
    error: result.error,
  };
}
