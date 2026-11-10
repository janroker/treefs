import { useState } from 'react';
import type { FolderId, Item, ItemType } from '../api/api.types';
import type { Browser } from './hooks.types';
import { useFolderUrl } from './useFolderUrl';

export function useBrowser(): Browser {
  const [folderId, openFolder] = useFolderUrl();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [creating, setCreating] = useState<ItemType | null>(null);

  function open(nextFolderId: FolderId): void {
    setHighlightedId(null);
    setCreating(null);
    openFolder(nextFolderId);
  }

  function select(item: Item): void {
    const isFolder = item.type === 'folder';
    setCreating(null);
    openFolder(isFolder ? item.id : item.parentId);
    setHighlightedId(isFolder ? null : item.id);
  }

  return {
    folderId,
    highlightedId,
    creating,
    open,
    select,
    startCreate: setCreating,
    finishCreate: () => setCreating(null),
  };
}
