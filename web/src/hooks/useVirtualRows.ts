import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect } from 'react';
import type { VirtualRows, VirtualRowsConfig } from './hooks.types';

const ROW_HEIGHT = 40;
const OVERSCAN_ROWS = 10;
const PREFETCH_ROWS = 20;

export function useVirtualRows({
  items,
  scrollRef,
  focus,
  onNearEnd,
}: VirtualRowsConfig): VirtualRows {
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual returns functions the React Compiler cannot memoize; nothing here is memoized by hand
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN_ROWS,
  });
  const rows = virtualizer.getVirtualItems();
  const lastRowIndex = rows.at(-1)?.index ?? 0;
  const focusIndex = items.findIndex((item) => item.id === focus?.id);
  const flash = focus?.flash === true;

  useEffect(() => {
    if (lastRowIndex >= items.length - PREFETCH_ROWS) {
      onNearEnd();
    }
  }, [lastRowIndex, items.length, onNearEnd]);

  useEffect(() => {
    if (focusIndex !== -1) {
      virtualizer.scrollToIndex(focusIndex, {
        align: flash ? 'center' : 'auto',
      });
    }
  }, [virtualizer, focusIndex, flash]);

  return {
    rows,
    totalSize: virtualizer.getTotalSize(),
    measure: virtualizer.measureElement,
  };
}
