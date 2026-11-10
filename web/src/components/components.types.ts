import type { FolderId, Item, ItemType, MatchMode } from '../api/api.types';

export type OpenFolderProps = {
  onOpen: (folderId: FolderId) => void;
};

export type FolderIdProps = {
  folderId: FolderId;
};

export type BreadcrumbsProps = FolderIdProps & OpenFolderProps;

export type FolderViewProps = FolderIdProps & OpenFolderProps;

export type ItemRowProps = OpenFolderProps & { item: Item };

export type DeleteButtonProps = {
  id: string;
  name: string;
};

export type TypeFilter = ItemType | 'both';

export type SearchResultsProps = OpenFolderProps & { items: Array<Item> };

export type SearchOptionsProps = {
  typeFilter: TypeFilter;
  onTypeFilter: (typeFilter: TypeFilter) => void;
  match: MatchMode;
  onMatch: (match: MatchMode) => void;
};
