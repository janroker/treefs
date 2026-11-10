import { type ReactNode, useRef } from 'react';
import type { Item } from '../api/api.types';
import { useVirtualRows } from '../hooks/useVirtualRows';
import type { VirtualRowsProps } from './components.types';
import { ItemRow } from './ItemRow';

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

export function VirtualRows({
  items,
  focus,
  onFocusItem,
  onNearEnd,
  onOpen,
}: Readonly<VirtualRowsProps>): ReactNode {
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtual = useVirtualRows({ items, scrollRef, focus, onNearEnd });

  return (
    <div ref={scrollRef} className="scroller">
      <ul className="virtual" style={{ height: virtual.totalSize }}>
        {virtual.rows.map((row) => {
          const item = items[row.index];
          return item === undefined ? null : (
            <ItemRow
              key={item.id}
              item={item}
              index={row.index}
              top={row.start}
              measure={virtual.measure}
              focus={focus}
              onOpen={onOpen}
              onDeleted={() => focusNeighbor(items, row.index, onFocusItem)}
            />
          );
        })}
      </ul>
    </div>
  );
}
