import { useState } from 'react';
import type { FolderId, Item, ItemType } from '../api/api.types';
import type { RowFocus } from '../components/components.types';
import type { Browser } from './hooks.types';
import { useFolderUrl } from './useFolderUrl';

export function useBrowser(): Browser {
  const [folderId, openFolder] = useFolderUrl();
  const [focus, setFocus] = useState<RowFocus | null>(null);
  const [creating, setCreating] = useState<ItemType | null>(null);

  function open(nextFolderId: FolderId): void {
    setFocus(null);
    setCreating(null);
    openFolder(nextFolderId);
  }

  function select(item: Item): void {
    const isFolder = item.type === 'folder';
    setCreating(null);
    openFolder(isFolder ? item.id : item.parentId);
    setFocus(isFolder ? null : { id: item.id, flash: true });
  }

  return {
    folderId,
    focus,
    creating,
    open,
    select,
    startCreate: setCreating,
    cancelCreate: () => setCreating(null),
    created: (item) => {
      setCreating(null);
      setFocus({ id: item.id, flash: true });
    },
    focusItem: (id) => setFocus({ id, flash: false }),
  };
}
