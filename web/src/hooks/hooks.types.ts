import type { KeyboardEvent } from 'react';
import type { FolderId, Item, MatchMode } from '../api/api.types';
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
  dismiss: () => void;
};

export type SearchQuery = {
  query: string;
  items: Array<Item>;
  open: boolean;
  error: Error | null;
};

export type ActiveOptionConfig = {
  count: number;
  onChoose: (index: number) => void;
  onDismiss: () => void;
};

export type ActiveOption = {
  activeIndex: number;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export type SearchNavigationConfig = {
  items: Array<Item>;
  onSelect: (item: Item) => void;
  onDismiss: () => void;
};

export type SearchNavigation = ActiveOption & {
  listId: string;
  activeId: string | undefined;
  choose: (index: number) => void;
};
