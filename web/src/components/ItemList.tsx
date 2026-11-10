import type { ReactNode } from 'react';
import type { ItemListProps } from './components.types';
import { NewItemRow } from './NewItemRow';
import { VirtualRows } from './VirtualRows';

export function ItemList({
  folderId,
  creating,
  onCreated,
  onCreateCancel,
  ...rowsProps
}: Readonly<ItemListProps>): ReactNode {
  if (rowsProps.items.length === 0 && creating === null) {
    return (
      <p className="empty" aria-live="polite">
        This folder is empty.
      </p>
    );
  }
  return (
    <div className="items">
      {creating !== null && (
        <ul className="new-items">
          <NewItemRow
            type={creating}
            folderId={folderId}
            onCreated={onCreated}
            onCancel={onCreateCancel}
          />
        </ul>
      )}
      <VirtualRows {...rowsProps} />
    </div>
  );
}
