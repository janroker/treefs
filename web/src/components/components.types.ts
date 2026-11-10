import type { KeyboardEvent, ReactNode } from 'react';
import type { FolderId, Item, ItemType, MatchMode } from '../api/api.types';
import type { SearchForm, SearchQuery } from '../hooks/hooks.types';

type OpenFolderProps = {
  onOpen: (folderId: FolderId) => void;
};

export type FolderIdProps = {
  folderId: FolderId;
};

export type BreadcrumbsProps = FolderIdProps & OpenFolderProps;

export type FolderViewProps = FolderIdProps &
  OpenFolderProps & { highlightedId: string | null };

export type ItemRowProps = OpenFolderProps & {
  item: Item;
  highlighted: boolean;
};

export type FolderLinkProps = OpenFolderProps & {
  folderId: FolderId;
  children: ReactNode;
};

export type DeleteButtonProps = {
  id: string;
  name: string;
};

export type TypeFilter = ItemType | 'both';

export type SearchResultsProps = {
  items: Array<Item>;
  query: string;
  match: MatchMode;
  listId: string;
  activeIndex: number;
  onChoose: (index: number) => void;
};

export type SearchResultRowProps = Omit<
  SearchResultsProps,
  'items' | 'listId' | 'onChoose' | 'activeIndex'
> & {
  item: Item;
  id: string;
  onChoose: () => void;
  active: boolean;
};

export type SearchScope = 'folder' | 'everywhere';

export type ScopeSelectProps = {
  scope: SearchScope;
  onScope: (scope: SearchScope) => void;
};

export type SearchBoxProps = FolderIdProps & {
  onSelect: (item: Item) => void;
};

export type SearchOptionsProps = {
  insideFolder: boolean;
  scope: SearchScope;
  onScope: (scope: SearchScope) => void;
  typeFilter: TypeFilter;
  onTypeFilter: (typeFilter: TypeFilter) => void;
  match: MatchMode;
  onMatch: (match: MatchMode) => void;
};

export type MatchedNameProps = {
  name: string;
  query: string;
  match: MatchMode;
};

export type SearchFieldProps = {
  form: SearchForm;
  search: SearchQuery;
  onSelect: (item: Item) => void;
};

export type ItemListProps = OpenFolderProps & {
  items: Array<Item>;
  highlightedId: string | null;
};

export type SearchInputProps = {
  form: SearchForm;
  open: boolean;
  listId: string;
  activeId: string | undefined;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};
