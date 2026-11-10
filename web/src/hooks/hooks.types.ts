import type { FolderId } from '../api/api.types';

export type FolderUrl = readonly [FolderId, (folderId: FolderId) => void];
