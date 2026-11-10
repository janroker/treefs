import { type JSX, useState } from 'react';
import type { FolderId } from './api/api.types';
import { Breadcrumbs } from './components/Breadcrumbs';
import { CreateItemForm } from './components/CreateItemForm';
import { FolderView } from './components/FolderView';

export function App(): JSX.Element {
  const [folderId, setFolderId] = useState<FolderId>(null);

  return (
    <main className="app">
      <h1>Files</h1>
      <Breadcrumbs folderId={folderId} onOpen={setFolderId} />
      <CreateItemForm folderId={folderId} />
      <FolderView folderId={folderId} onOpen={setFolderId} />
    </main>
  );
}
