import type { ReactNode } from 'react';
import { useItemDetail } from './api/items';
import { FolderView } from './components/FolderView';
import { SearchBox } from './components/SearchBox';
import { Toolbar } from './components/Toolbar';
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
        <div className="topbar-inner">
          <h1>{APP_NAME}</h1>
          <SearchBox folderId={browser.folderId} onSelect={browser.select} />
        </div>
      </header>
      <main className="content">
        <Toolbar
          folderId={browser.folderId}
          onOpen={browser.open}
          onCreate={browser.startCreate}
        />
        <FolderView
          folderId={browser.folderId}
          focus={browser.focus}
          creating={browser.creating}
          onCreated={browser.created}
          onCreateCancel={browser.cancelCreate}
          onFocusItem={browser.focusItem}
          filterName={browser.filterName}
          onShowOnly={browser.showOnly}
          onClearFilter={browser.clearFilter}
          onOpen={browser.open}
        />
      </main>
    </>
  );
}
