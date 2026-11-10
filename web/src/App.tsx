import type { ReactNode } from 'react';
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
  const { data: folder } = useItemDetail(folderId);
  useDocumentTitle(
    folder === undefined ? APP_NAME : `${folder.name} · ${APP_NAME}`,
  );

  return (
    <main className="app">
      <h1>{APP_NAME}</h1>
      <SearchBox folderId={folderId} onOpen={openFolder} />
      <Breadcrumbs folderId={folderId} onOpen={openFolder} />
      <CreateItemForm folderId={folderId} />
      <FolderView folderId={folderId} onOpen={openFolder} />
    </main>
  );
}
