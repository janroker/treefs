import { type ReactNode, useState } from 'react';
import type { FolderId, Item } from './api/api.types';
import { useItemDetail } from './api/items';
import { Breadcrumbs } from './components/Breadcrumbs';
import { CreateItemForm } from './components/CreateItemForm';
import { FolderView } from './components/FolderView';
import { SearchBox } from './components/SearchBox';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { useFolderUrl } from './hooks/useFolderUrl';

const APP_NAME = 'treefs';

export function App(): ReactNode {
  const [folderId, openFolder] = useFolderUrl();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const { data: folder } = useItemDetail(folderId);
  useDocumentTitle(
    folder === undefined ? APP_NAME : `${folder.name} · ${APP_NAME}`,
  );

  function open(nextFolderId: FolderId): void {
    setHighlightedId(null);
    openFolder(nextFolderId);
  }

  function select(item: Item): void {
    const isFolder = item.type === 'folder';
    openFolder(isFolder ? item.id : item.parentId);
    setHighlightedId(isFolder ? null : item.id);
  }

  return (
    <>
      <header className="topbar">
        <h1>{APP_NAME}</h1>
        <SearchBox folderId={folderId} onSelect={select} />
      </header>
      <main className="content">
        <div className="toolbar">
          <Breadcrumbs folderId={folderId} onOpen={open} />
          <CreateItemForm folderId={folderId} />
        </div>
        <FolderView
          folderId={folderId}
          highlightedId={highlightedId}
          onOpen={open}
        />
      </main>
    </>
  );
}
