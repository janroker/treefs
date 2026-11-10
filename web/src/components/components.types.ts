import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import type { KeyboardEvent, ReactNode, RefObject } from 'react';
import type {
  FolderId,
  Item,
  ItemPage,
  ItemType,
  MatchMode,
} from '../api/api.types';
import type {
  SearchForm,
  SearchNavigation,
  SearchQuery,
} from '../hooks/hooks.types';

type OpenFolderProps = {
  onOpen: (folderId: FolderId) => void;
};

type FolderIdProps = {
  folderId: FolderId;
};

export type BreadcrumbsProps = FolderIdProps & OpenFolderProps;

export type RowFocus = { id: string; name: string; flash: boolean };

type CreateProps = {
  creating: ItemType | null;
  onCreated: (item: Item) => void;
  onCreateCancel: () => void;
};

type FocusProps = {
  focus: RowFocus | null;
  onFocusItem: (item: Item) => void;
};

type FilterProps = {
  filterName: string | null;
  onShowOnly: (name: string) => void;
  onClearFilter: () => void;
};

export type FolderViewProps = FolderIdProps &
  OpenFolderProps &
  CreateProps &
  FocusProps &
  FilterProps;

export type FolderNoticeProps = FilterProps & {
  locateName: string | null;
};

export type ItemRowProps = OpenFolderProps & {
  item: Item;
  index: number;
  top: number;
  measure: (node: HTMLElement | null) => void;
  focus: RowFocus | null;
  onDeleted: () => void;
};

export type FolderLinkProps = OpenFolderProps & {
  folderId: FolderId;
  children: ReactNode;
};

export type DeleteButtonProps = {
  id: string;
  name: string;
  type: ItemType;
  onDeleted: () => void;
};

export type DeleteConfirmProps = {
  name: string;
  type: ItemType;
  pending: boolean;
  error: Error | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export type TypeFilter = ItemType | 'both';

export type SearchResultsProps = {
  items: Array<Item>;
  query: string;
  match: MatchMode;
  listId: string;
  activeIndex: number;
  onChoose: (index: number) => void;
  onWiden: (() => void) | null;
  stale: boolean;
};

export type SearchResultRowProps = Omit<
  SearchResultsProps,
  'items' | 'listId' | 'onChoose' | 'activeIndex' | 'onWiden' | 'stale'
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
  form: SearchForm;
  insideFolder: boolean;
};

export type MatchedNameProps = {
  name: string;
  query: string;
  match: MatchMode;
};

export type SearchFieldProps = {
  form: SearchForm;
  insideFolder: boolean;
  search: SearchQuery;
  onSelect: (item: Item) => void;
};

export type VirtualRowsProps = OpenFolderProps &
  FocusProps & { items: Array<Item>; onNearEnd: () => void };

export type ItemListProps = FolderIdProps & CreateProps & VirtualRowsProps;

export type NewItemRowProps = FolderIdProps & {
  type: ItemType;
  onCreated: (item: Item) => void;
  onCancel: () => void;
};

export type NewItemButtonsProps = {
  onCreate: (type: ItemType) => void;
};

export type SearchInputProps = {
  form: SearchForm;
  open: boolean;
  listId: string;
  activeId: string | undefined;
  inputRef: RefObject<HTMLInputElement | null>;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

export type SearchPopupProps = {
  form: SearchForm;
  insideFolder: boolean;
  search: SearchQuery;
  navigation: SearchNavigation;
  onWiden: () => void;
};

export type NoMatchesProps = {
  onWiden: (() => void) | null;
};

export type SearchFooterProps = {
  search: SearchQuery;
};

export type LoadMoreProps = {
  folder: UseInfiniteQueryResult<InfiniteData<ItemPage>>;
  itemCount: number;
  onFocusItem: (item: Item) => void;
};

export type ItemNameProps = {
  name: string;
};
