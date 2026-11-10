import type { ReactNode } from 'react';
import type { Item } from '../api/api.types';
import type { ItemListProps } from './components.types';
import { ItemRow } from './ItemRow';
import { NewItemRow } from './NewItemRow';

function focusNeighbor(
  items: ReadonlyArray<Item>,
  index: number,
  onFocusItem: (item: Item) => void,
): void {
  const neighbor = items[index + 1] ?? items[index - 1];
  if (neighbor !== undefined) {
    onFocusItem(neighbor);
  }
}

export function ItemList({
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
