import type { UseQueryResult } from '@tanstack/react-query';
import type { FolderId, ItemPage, MatchMode } from '../api/api.types';
import type { SearchScope, TypeFilter } from '../components/components.types';

export type FolderUrl = readonly [FolderId, (folderId: FolderId) => void];

export type SearchForm = {
  text: string;
  setText: (text: string) => void;
  focused: boolean;
  setFocused: (focused: boolean) => void;
  match: MatchMode;
  setMatch: (match: MatchMode) => void;
  typeFilter: TypeFilter;
  setTypeFilter: (typeFilter: TypeFilter) => void;
  scope: SearchScope;
  setScope: (scope: SearchScope) => void;
};

export type SearchQuery = {
  enabled: boolean;
  result: UseQueryResult<ItemPage>;
};
