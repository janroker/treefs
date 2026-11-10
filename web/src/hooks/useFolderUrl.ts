import { useCallback, useEffect, useState } from 'react';
import type { FolderId } from '../api/api.types';
import type { FolderUrl } from './hooks.types';

const FOLDER_PARAM = 'folder';

function readFolderId(): FolderId {
  return new URLSearchParams(window.location.search).get(FOLDER_PARAM);
}

function urlOfFolder(folderId: FolderId): string {
  if (folderId === null) {
    return window.location.pathname;
  }
  return `${window.location.pathname}?${new URLSearchParams({ [FOLDER_PARAM]: folderId }).toString()}`;
}

export function useFolderUrl(): FolderUrl {
  const [folderId, setFolderId] = useState(readFolderId);

  useEffect(() => {
    const syncFromUrl = (): void => setFolderId(readFolderId());
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const openFolder = useCallback((nextFolderId: FolderId): void => {
    window.history.pushState(null, '', urlOfFolder(nextFolderId));
    setFolderId(nextFolderId);
  }, []);

  return [folderId, openFolder];
}
