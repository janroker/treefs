import type { ReactNode } from 'react';
import { useFolderItems } from '../api/items';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import type { Item, ItemPage } from '../api/api.types';
import type { FolderViewProps, ItemListProps } from './components.types';
import { ItemRow } from './ItemRow';
import { NewItemRow } from './NewItemRow';

function focusNeighbor(
  items: ReadonlyArray<Item>,
  index: number,
  onFocusItem: (id: string) => void,
): void {
  const neighbor = items[index + 1] ?? items[index - 1];
  if (neighbor !== undefined) {
    onFocusItem(neighbor.id);
  }
}

function ItemList({
  folderId,
  items,
  creating,
  onCreated,
  onCreateCancel,
  focus,
  onFocusItem,
  onOpen,
}: Readonly<ItemListProps>): ReactNode {
  if (items.length === 0 && creating === null) {
    return (
      <p className="empty" aria-live="polite">
        This folder is empty.
      </p>
    );
  }
  return (
    <ul className="items">
      {creating !== null && (
        <NewItemRow
          type={creating}
          folderId={folderId}
          onCreated={onCreated}
          onCancel={onCreateCancel}
        />
      )}
      {items.map((item, index) => (
        <ItemRow
          key={item.id}
          item={item}
          focus={focus}
          onOpen={onOpen}
          onDeleted={() => focusNeighbor(items, index, onFocusItem)}
        />
      ))}
    </ul>
  );
}

async function loadMore(
  folder: UseInfiniteQueryResult<InfiniteData<ItemPage>>,
  onFocusItem: (id: string) => void,
): Promise<void> {
  const result = await folder.fetchNextPage();
  const firstNew = result.data?.pages.at(-1)?.items[0];
  if (firstNew !== undefined) {
    onFocusItem(firstNew.id);
  }
}

export function FolderView({
  folderId,
  ...listProps
}: Readonly<FolderViewProps>): ReactNode {
  const folder = useFolderItems(folderId);

  if (folder.isPending) {
    return <p className="muted">Loading...</p>;
  }
  if (folder.isError) {
    return (
      <p role="alert">Could not load this folder: {folder.error.message}</p>
    );
  }
  return (
    <section aria-label="Folder contents">
      <ItemList
        {...listProps}
        folderId={folderId}
        items={folder.data.pages.flatMap((page) => page.items)}
      />
      {folder.hasNextPage ? (
        <button
          type="button"
          className="load-more"
          disabled={folder.isFetchingNextPage}
          onClick={() => void loadMore(folder, listProps.onFocusItem)}
        >
          Load more
        </button>
      ) : null}
    </section>
  );
}
