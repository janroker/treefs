import type { KeyboardEvent, RefObject, SyntheticEvent } from 'react';
import type { FolderId, Item, ItemType, MatchMode } from '../api/api.types';
import type {
  RowFocus,
  SearchScope,
  TypeFilter,
} from '../components/components.types';

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
  showResults: boolean;
  stale: boolean;
  error: Error | null;
};

export type ActiveOptionConfig = {
  count: number;
  resetKey: string;
  onChoose: (index: number) => void;
  onDismiss: () => void;
};

export type ActiveOption = {
  activeIndex: number;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export type SearchNavigationConfig = {
  items: Array<Item>;
  locked: boolean;
  resetKey: string;
  onSelect: (item: Item) => void;
  onDismiss: () => void;
};

export type SearchNavigation = ActiveOption & {
  listId: string;
  activeId: string | undefined;
  choose: (index: number) => void;
};

export type NewItemFormConfig = {
  type: ItemType;
  folderId: FolderId;
  inputRef: RefObject<HTMLInputElement | null>;
  onCreated: (item: Item) => void;
};

export type NewItemForm = {
  name: string;
  setName: (name: string) => void;
  submit: (event: SyntheticEvent<HTMLFormElement>) => void;
  canSubmit: boolean;
  message: string | null;
};

export type Browser = {
  folderId: FolderId;
  focus: RowFocus | null;
  creating: ItemType | null;
  open: (folderId: FolderId) => void;
  select: (item: Item) => void;
  startCreate: (type: ItemType) => void;
  cancelCreate: () => void;
  created: (item: Item) => void;
  focusItem: (id: string) => void;
};
