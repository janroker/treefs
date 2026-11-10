import type { ReactNode } from 'react';
import { useFolderItems } from '../api/items';
import type { Item } from '../api/api.types';
import type {
  FolderViewProps,
  LoadMoreProps,
  RowFocus,
} from './components.types';
import { FolderNotice } from './FolderNotice';
import { ItemList } from './ItemList';
import { LoadMore } from './LoadMore';

function locateNameOf(
  focus: RowFocus | null,
  items: ReadonlyArray<Item>,
  canLocate: boolean,
): string | null {
  const missing =
    focus?.flash === true && !items.some((item) => item.id === focus.id);
  return missing && canLocate ? focus.name : null;
}

function loadNextPage(folder: LoadMoreProps['folder']): void {
  if (folder.hasNextPage && !folder.isFetchingNextPage) {
    void folder.fetchNextPage();
  }
}

export function FolderView({
  folderId,
  filterName,
  onShowOnly,
  onClearFilter,
  ...listProps
}: Readonly<FolderViewProps>): ReactNode {
  const folder = useFolderItems(folderId, filterName);

  if (folder.isPending) {
    return <p className="muted">Loading...</p>;
  }
  if (folder.isError) {
    return (
      <p role="alert">Could not load this folder: {folder.error.message}</p>
    );
  }
  const items = folder.data.pages.flatMap((page) => page.items);
  const canLocate = folder.hasNextPage && filterName === null;
  return (
    <section aria-label="Folder contents">
      <FolderNotice
        filterName={filterName}
        locateName={locateNameOf(listProps.focus, items, canLocate)}
        onShowOnly={onShowOnly}
        onClearFilter={onClearFilter}
      />
      <ItemList
        {...listProps}
        folderId={folderId}
        items={items}
        onNearEnd={() => loadNextPage(folder)}
      />
      <LoadMore
        folder={folder}
        itemCount={items.length}
        onFocusItem={listProps.onFocusItem}
      />
    </section>
  );
}
