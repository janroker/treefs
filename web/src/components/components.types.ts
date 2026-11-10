import type { FolderId, Item } from '../api/api.types';

type OpenFolderProps = {
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
