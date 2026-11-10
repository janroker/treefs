import type { ReactNode } from 'react';
import { useItemDetail } from './api/items';
import { Breadcrumbs } from './components/Breadcrumbs';
import { FolderView } from './components/FolderView';
import { NewItemButtons } from './components/NewItemButtons';
import { SearchBox } from './components/SearchBox';
import { useBrowser } from './hooks/useBrowser';
import { useDocumentTitle } from './hooks/useDocumentTitle';

const APP_NAME = 'treefs';

export function App(): ReactNode {
  const browser = useBrowser();
  const { data: folder } = useItemDetail(browser.folderId);
  useDocumentTitle(
    folder === undefined ? APP_NAME : `${folder.name} · ${APP_NAME}`,
  );

  return (
    <>
      <header className="topbar">
        <h1>{APP_NAME}</h1>
        <SearchBox folderId={browser.folderId} onSelect={browser.select} />
      </header>
      <main className="content">
        <div className="toolbar">
          <Breadcrumbs folderId={browser.folderId} onOpen={browser.open} />
          <NewItemButtons onCreate={browser.startCreate} />
        </div>
        <FolderView
          folderId={browser.folderId}
          focus={browser.focus}
          creating={browser.creating}
          onCreated={browser.created}
          onCreateCancel={browser.cancelCreate}
          onFocusItem={browser.focusItem}
          onOpen={browser.open}
        />
      </main>
    </>
  );
}
